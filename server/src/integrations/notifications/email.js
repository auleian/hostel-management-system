import nodemailer from "nodemailer";
import { logger } from "../../middleware/logger.js";

let _transporter = null;

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    logger.warn("[email] SMTP not configured — emails will be skipped");
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
};

const getTransporter = () => {
  if (_transporter === null) _transporter = buildTransporter();
  return _transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  if (!transporter) {
    return { skipped: true, reason: "SMTP not configured" };
  }
  if (!to) {
    return { skipped: true, reason: "no recipient" };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    logger.info(`[email] sent to ${to} (${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`[email] failed to ${to}: ${err.message}`);
    return { sent: false, error: err.message };
  }
};
