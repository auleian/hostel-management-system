import { sendEmail } from "./email.js";
import { sendSms } from "./sms.js";
import { templates } from "./templates.js";
import { EVENTS } from "../lib/eventTypes.js";
import { logger } from "../../middleware/logger.js";

/**
 * Channel routing per event type. Either "email", "sms", or both.
 */
const channelMap = {
  [EVENTS.BOOKING_CREATED]: ["email", "sms"],
  [EVENTS.BOOKING_CONFIRMED]: ["email", "sms"],
  [EVENTS.BOOKING_CANCELLED]: ["email"],
  [EVENTS.PAYMENT_INITIATED]: ["sms"],
  [EVENTS.PAYMENT_SUCCESSFUL]: ["email", "sms"],
  [EVENTS.PAYMENT_FAILED]: ["email", "sms"],
  [EVENTS.NEW_BOOKING_FOR_OWNER]: ["email", "sms"],
};

/**
 * Recipient extractor — different events have different "primary" recipients.
 */
const recipientFor = (eventType, payload) => {
  switch (eventType) {
    case EVENTS.NEW_BOOKING_FOR_OWNER:
      return { email: payload.owner?.email, phone: payload.owner?.contact };
    default:
      return { email: payload.user?.email, phone: payload.user?.contact };
  }
};

/**
 * Dispatch an event to its configured channels. Never throws — failures are logged
 * so they don't break the calling request flow.
 */
export const dispatch = async (eventType, payload) => {
  const tplFn = templates[eventType];
  if (!tplFn) {
    logger.warn(`[notifications] no template for event ${eventType}`);
    return { dispatched: false, reason: "no template" };
  }
  const channels = channelMap[eventType] || ["email"];
  const tpl = tplFn(payload);
  const { email, phone } = recipientFor(eventType, payload);

  const results = {};
  await Promise.all(
    channels.map(async (channel) => {
      try {
        if (channel === "email") {
          results.email = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
        } else if (channel === "sms") {
          results.sms = await sendSms({ to: phone, message: tpl.sms || tpl.text || tpl.subject });
        }
      } catch (err) {
        logger.error(`[notifications] channel ${channel} failed for ${eventType}: ${err.message}`);
        results[channel] = { sent: false, error: err.message };
      }
    })
  );
  return { dispatched: true, eventType, results };
};

export const NotificationService = { dispatch };
