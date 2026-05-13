import crypto from "crypto";
import { PaymentAdapter } from "./paymentAdapter.js";
import { createHttpClient, requestWithRetry } from "../lib/httpClient.js";
import { logger } from "../../middleware/logger.js";

/**
 * Airtel Money Collections API (sandbox).
 * Docs: https://developers.airtel.africa/
 *
 * Flow:
 *   1. POST /auth/oauth2/token  -> bearer token
 *   2. POST /merchant/v1/payments/  -> Request to Pay
 *   3. GET  /standard/v1/payments/{transactionId} -> status
 *   4. Optional callback URL configured at merchant level
 */
export class AirtelMoneyAdapter extends PaymentAdapter {
  constructor() {
    super("airtel");
    this.baseUrl = process.env.AIRTEL_BASE_URL || "https://openapiuat.airtel.africa";
    this.clientId = process.env.AIRTEL_CLIENT_ID;
    this.clientSecret = process.env.AIRTEL_CLIENT_SECRET;
    this.country = process.env.AIRTEL_COUNTRY || "UG";
    this.currency = process.env.AIRTEL_CURRENCY || "UGX";
    this.webhookSecret = process.env.AIRTEL_WEBHOOK_SECRET || null;

    this.http = createHttpClient({ baseURL: this.baseUrl, timeout: 15000 });
    this._tokenCache = { token: null, expiresAt: 0 };
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientSecret);
  }

  async _getAccessToken() {
    if (this._tokenCache.token && Date.now() < this._tokenCache.expiresAt - 30_000) {
      return this._tokenCache.token;
    }
    const res = await requestWithRetry(
      this.http,
      {
        url: "/auth/oauth2/token",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
        },
      },
      { context: "airtel:token" }
    );
    const { access_token, expires_in } = res.data || {};
    if (!access_token) throw new Error("Airtel token response missing access_token");
    this._tokenCache = {
      token: access_token,
      expiresAt: Date.now() + (Number(expires_in) || 3600) * 1000,
    };
    return access_token;
  }

  async initiate({ amount, phoneNumber, transactionReference, description }) {
    if (!this.isConfigured()) throw new Error("Airtel Money not configured");
    const token = await this._getAccessToken();
    const msisdn = phoneNumber.replace(/^\+/, "").replace(/^256/, "");

    const payload = {
      reference: (description || "Hostel booking").slice(0, 60),
      subscriber: { country: this.country, currency: this.currency, msisdn },
      transaction: { amount: Number(amount), country: this.country, currency: this.currency, id: transactionReference },
    };

    let res;
    try {
      res = await requestWithRetry(
        this.http,
        {
          url: "/merchant/v1/payments/",
          method: "POST",
          headers: {
            "X-Country": this.country,
            "X-Currency": this.currency,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: payload,
        },
        { context: "airtel:requesttopay" }
      );
    } catch (err) {
      logger.error("[airtel:initiate] failed", err.response?.data || err.message);
      return {
        status: "failed",
        providerReference: null,
        reason: err.response?.data?.status?.message || err.message,
        raw: err.response?.data || { error: err.message },
      };
    }

    const apiStatus = res.data?.status;
    if (apiStatus && apiStatus.success === false) {
      return {
        status: "failed",
        providerReference: res.data?.data?.transaction?.id || null,
        reason: apiStatus.message || apiStatus.response_code || "initiation rejected",
        raw: res.data,
      };
    }

    return {
      status: "pending",
      providerReference: res.data?.data?.transaction?.id || transactionReference,
      reason: null,
      raw: { httpStatus: res.status, data: res.data ?? null },
    };
  }

  async verify({ transactionReference }) {
    if (!this.isConfigured()) throw new Error("Airtel Money not configured");
    const token = await this._getAccessToken();
    let res;
    try {
      res = await requestWithRetry(
        this.http,
        {
          url: `/standard/v1/payments/${transactionReference}`,
          method: "GET",
          headers: {
            "X-Country": this.country,
            "X-Currency": this.currency,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
        { context: "airtel:verify" }
      );
    } catch (err) {
      logger.error("[airtel:verify] failed", err.response?.data || err.message);
      return {
        status: "failed",
        providerReference: transactionReference,
        reason: err.response?.data?.status?.message || err.message,
        raw: err.response?.data || { error: err.message },
      };
    }

    const txn = res.data?.data?.transaction || {};
    const providerStatus = String(txn.status || "").toUpperCase();
    let status;
    switch (providerStatus) {
      case "TS":
      case "SUCCESS":
      case "SUCCESSFUL":
        status = "successful";
        break;
      case "TF":
      case "FAILED":
        status = "failed";
        break;
      case "TIP":
      case "PENDING":
      case "":
        status = "pending";
        break;
      default:
        status = "pending";
    }
    return {
      status,
      providerReference: txn.airtel_money_id || transactionReference,
      reason: txn.message || res.data?.status?.message || null,
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
    const txn = body.transaction || body.data?.transaction || {};
    const apiStatus = String(txn.status_code || txn.status || "").toUpperCase();
    let status;
    if (apiStatus === "TS" || apiStatus === "SUCCESS" || apiStatus === "SUCCESSFUL") status = "successful";
    else if (apiStatus === "TF" || apiStatus === "FAILED") status = "failed";
    else status = "pending";
    return {
      transactionReference: txn.id || null,
      providerReference: txn.airtel_money_id || null,
      status,
      reason: txn.message || null,
      raw: body,
    };
  }

  verifyWebhookSignature({ headers, rawBody }) {
    if (!this.webhookSecret) return true;
    const provided = headers["x-auth-token"] || headers["x-webhook-secret"];
    if (!provided) return false;
    const computed = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody || {}))
      .digest("hex");
    const a = Buffer.from(String(provided));
    const b = Buffer.from(computed);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
}
