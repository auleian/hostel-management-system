import AfricasTalking from "africastalking";
import { logger } from "../../middleware/logger.js";

let _client = null;

const getClient = () => {
  if (_client !== null) return _client;
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME || "sandbox";
  if (!apiKey) {
    logger.warn("[sms] Africa's Talking not configured — SMS will be skipped");
    _client = false;
    return _client;
  }
  _client = AfricasTalking({ apiKey, username });
  return _client;
};

const normalisePhone = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+256${digits.slice(1)}`;
  if (digits.startsWith("256")) return `+${digits}`;
  return digits;
};

export const sendSms = async ({ to, message }) => {
  const client = getClient();
  if (!client) return { skipped: true, reason: "SMS provider not configured" };
  const recipient = normalisePhone(to);
  if (!recipient) return { skipped: true, reason: "no phone number" };
  try {
    const sms = client.SMS;
    const from = process.env.AT_SENDER_ID || undefined;
    const result = await sms.send({ to: [recipient], message, from });
    logger.info(`[sms] sent to ${recipient}: ${JSON.stringify(result?.SMSMessageData?.Recipients?.[0] || result)}`);
    return { sent: true, result };
  } catch (err) {
    logger.error(`[sms] failed to ${recipient}: ${err.message}`);
    return { sent: false, error: err.message };
  }
};
