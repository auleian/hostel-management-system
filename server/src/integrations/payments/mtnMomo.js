import crypto from "crypto";
import { PaymentAdapter } from "./paymentAdapter.js";
import { createHttpClient, requestWithRetry } from "../lib/httpClient.js";
import { logger } from "../../middleware/logger.js";

/**
 * MTN MoMo Collections API (sandbox).
 * Docs: https://momodeveloper.mtn.com/docs/services/collection
 *
 * Flow:
 *   1. POST /collection/token/  -> bearer token (cached briefly)
 *   2. POST /collection/v1_0/requesttopay  -> 202 Accepted, async
 *   3. GET  /collection/v1_0/requesttopay/{referenceId} -> status
 *   4. (Optional) callbackUrl receives final status
 */
export class MtnMomoAdapter extends PaymentAdapter {
  constructor() {
    super("mtn");
    this.baseUrl = process.env.MTN_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com";
    this.subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    this.apiUserId = process.env.MTN_MOMO_API_USER_ID;
    this.apiKey = process.env.MTN_MOMO_API_KEY;
    this.targetEnvironment = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "sandbox";
    this.currency = process.env.MTN_MOMO_CURRENCY || "EUR"; // sandbox accepts EUR; prod UGX
    this.sandboxUgxPerEur = Number(process.env.MTN_SANDBOX_UGX_PER_EUR || 4000);
    this.callbackHost = process.env.MTN_MOMO_CALLBACK_HOST || process.env.PUBLIC_BASE_URL;
    this.webhookSecret = process.env.MTN_MOMO_WEBHOOK_SECRET || null;

    this.http = createHttpClient({ baseURL: this.baseUrl, timeout: 15000 });
    this._tokenCache = { token: null, expiresAt: 0 };
  }

  isConfigured() {
    return Boolean(this.subscriptionKey && this.apiUserId && this.apiKey);
  }

  async _getAccessToken() {
    if (this._tokenCache.token && Date.now() < this._tokenCache.expiresAt - 30_000) {
      return this._tokenCache.token;
    }
    const basic = Buffer.from(`${this.apiUserId}:${this.apiKey}`).toString("base64");
    const res = await requestWithRetry(
      this.http,
      {
        url: "/collection/token/",
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          Authorization: `Basic ${basic}`,
        },
      },
      { context: "mtn:token" }
    );
    const { access_token, expires_in } = res.data || {};
    if (!access_token) throw new Error("MTN MoMo token response missing access_token");
    this._tokenCache = {
      token: access_token,
      expiresAt: Date.now() + (Number(expires_in) || 3600) * 1000,
    };
    return access_token;
  }

  async initiate({ amount, phoneNumber, transactionReference, description }) {
    if (!this.isConfigured()) throw new Error("MTN MoMo not configured");
    const token = await this._getAccessToken();
    const referenceId = transactionReference; // must be a UUID

    // Sandbox+EUR caps amounts low (~10k EUR). Booking prices are in UGX, so
    // convert UGX→EUR using a fixed dev rate. Production path is untouched.
    let sendAmount = Number(amount);
    if (this.targetEnvironment === "sandbox" && this.currency === "EUR" && this.sandboxUgxPerEur > 0) {
      const converted = Math.max(1, Math.round(sendAmount / this.sandboxUgxPerEur));
      logger.info(`[mtn:initiate] sandbox conversion ${sendAmount} UGX -> ${converted} EUR @ ${this.sandboxUgxPerEur}`);
      sendAmount = converted;
    }

    // MTN's API gateway 400s with no body when payerMessage/payeeNote contain
    // non-ASCII characters (em-dash, smart quotes, etc.). Strip aggressively.
    const toAscii = (s) => String(s || "").replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
    const note = toAscii(description || "Hostel booking").slice(0, 160) || "Hostel booking";

    const payload = {
      amount: String(sendAmount),
      currency: this.currency,
      externalId: referenceId,
      payer: { partyIdType: "MSISDN", partyId: phoneNumber.replace(/^\+/, "") },
      payerMessage: note,
      payeeNote: note,
    };

    const headers = {
      "X-Reference-Id": referenceId,
      "X-Target-Environment": this.targetEnvironment,
      "Ocp-Apim-Subscription-Key": this.subscriptionKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    if (this.callbackHost) {
      headers["X-Callback-Url"] = `${this.callbackHost.replace(/\/$/, "")}/api/payments/webhooks/mtn`;
    }

    logger.info(`[mtn:initiate] payload=${JSON.stringify(payload)} refId=${referenceId} env=${this.targetEnvironment} ccy=${this.currency}`);
    let res;
    try {
      res = await requestWithRetry(
        this.http,
        {
          url: "/collection/v1_0/requesttopay",
          method: "POST",
          headers,
          data: payload,
        },
        { context: "mtn:requesttopay" }
      );
    } catch (err) {
      const body = err.response?.data;
      const respHeaders = err.response?.headers || {};
      logger.error(`[mtn:initiate] failed status=${err.response?.status || ""} body=${typeof body === "object" ? JSON.stringify(body) : body || err.message} x-reference-id=${respHeaders["x-reference-id"] || respHeaders["X-Reference-Id"] || ""}`);
      return {
        status: "failed",
        providerReference: referenceId,
        reason: body?.message || body?.code || err.message,
        raw: body || { error: err.message },
      };
    }

    return {
      status: "pending",
      providerReference: referenceId,
      reason: null,
      raw: { httpStatus: res.status, data: res.data ?? null },
    };
  }

  async verify({ transactionReference }) {
    if (!this.isConfigured()) throw new Error("MTN MoMo not configured");
    const token = await this._getAccessToken();
    let res;
    try {
      res = await requestWithRetry(
        this.http,
        {
          url: `/collection/v1_0/requesttopay/${transactionReference}`,
          method: "GET",
          headers: {
            "X-Target-Environment": this.targetEnvironment,
            "Ocp-Apim-Subscription-Key": this.subscriptionKey,
            Authorization: `Bearer ${token}`,
          },
        },
        { context: "mtn:verify" }
      );
    } catch (err) {
      logger.error("[mtn:verify] failed", err.response?.data || err.message);
      return {
        status: "failed",
        providerReference: transactionReference,
        reason: err.response?.data?.message || err.message,
        raw: err.response?.data || { error: err.message },
      };
    }

    const providerStatus = String(res.data?.status || "").toUpperCase();
    logger.info(`[mtn:verify] ref=${transactionReference} body=${JSON.stringify(res.data)}`);
    let status;
    switch (providerStatus) {
      case "SUCCESSFUL":
        status = "successful";
        break;
      case "PENDING":
        status = "pending";
        break;
      case "FAILED":
        status = "failed";
        break;
      default:
        status = "pending";
    }
    return {
      status,
      providerReference: res.data?.financialTransactionId || transactionReference,
      reason: res.data?.reason || null,
      raw: res.data,
    };
  }

  parseWebhook(rawBody) {
    let body = rawBody;
    if (typeof rawBody === "string") {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = {};
      }
    }
    return {
      transactionReference: body.externalId || body.referenceId || null,
      providerReference: body.financialTransactionId || null,
      status: (() => {
        const s = String(body.status || "").toUpperCase();
        if (s === "SUCCESSFUL") return "successful";
        if (s === "FAILED") return "failed";
        return "pending";
      })(),
      reason: body.reason || null,
      raw: body,
    };
  }

  verifyWebhookSignature({ headers, rawBody }) {
    // MTN sandbox doesn't sign callbacks. If you've configured a shared secret,
    // require it as an `X-Webhook-Secret` header for a small extra defence.
    if (!this.webhookSecret) return true;
    const provided = headers["x-webhook-secret"] || headers["X-Webhook-Secret"];
    if (!provided) return false;
    const a = Buffer.from(String(provided));
    const b = Buffer.from(this.webhookSecret);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
}
