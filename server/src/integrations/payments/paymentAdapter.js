/**
 * PaymentAdapter — unified contract for mobile money providers.
 * Each provider implements: initiate(), verify(), parseWebhook(), verifyWebhookSignature().
 */
export class PaymentAdapter {
  constructor(name) {
    this.name = name;
  }

  // eslint-disable-next-line no-unused-vars
  async initiate({ amount, currency, phoneNumber, transactionReference, description, callbackUrl }) {
    throw new Error(`${this.name}: initiate() not implemented`);
  }

  // eslint-disable-next-line no-unused-vars
  async verify({ transactionReference, providerReference }) {
    throw new Error(`${this.name}: verify() not implemented`);
  }

  // eslint-disable-next-line no-unused-vars
  parseWebhook(rawBody) {
    throw new Error(`${this.name}: parseWebhook() not implemented`);
  }

  // eslint-disable-next-line no-unused-vars
  verifyWebhookSignature({ headers, rawBody }) {
    throw new Error(`${this.name}: verifyWebhookSignature() not implemented`);
  }
}

/**
 * Normalised result returned by initiate() and verify():
 * {
 *   status: 'pending' | 'successful' | 'failed' | 'cancelled',
 *   providerReference: string | null,
 *   reason: string | null,
 *   raw: object
 * }
 */
