import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";
import User from "../models/User.js";
import Room from "../models/roomModel.js";
import Hostel from "../models/hostelModel.js";
import { getPaymentAdapter, listProviders } from "../integrations/payments/index.js";
import { NotificationService } from "../integrations/notifications/notificationService.js";
import { EVENTS } from "../integrations/lib/eventTypes.js";
import { logger } from "../middleware/logger.js";

const generateTxRef = () => crypto.randomUUID();

export const getProviders = (_req, res) => {
  res.json({ providers: listProviders() });
};

/**
 * POST /api/payments/initiate
 * body: { bookingId, provider: 'mtn'|'airtel', phoneNumber }
 */
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId, provider, phoneNumber } = req.body;
    if (!bookingId || !provider || !phoneNumber) {
      return res.status(400).json({ message: "bookingId, provider, and phoneNumber are required" });
    }
    if (!["mtn", "airtel"].includes(provider)) {
      return res.status(400).json({ message: "provider must be 'mtn' or 'airtel'" });
    }

    const booking = await Booking.findById(bookingId).populate({ path: "room", populate: { path: "hostel" } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user?.id && booking.bookedby && String(booking.bookedby) !== String(req.user.id)) {
      return res.status(403).json({ message: "You may only pay for your own booking" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(409).json({ message: "Booking already paid" });
    }

    const amount = booking.amount && booking.amount > 0 ? booking.amount : booking.room?.price;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Booking has no amount and room has no price" });
    }

    const adapter = getPaymentAdapter(provider);
    if (!adapter.isConfigured()) {
      return res.status(503).json({ message: `${provider.toUpperCase()} payment provider not configured` });
    }

    const transactionReference = generateTxRef();
    const description = `Booking ${booking._id} — ${booking.room?.hostel?.name || "Hostel"}`;

    const payment = await Payment.create({
      booking: booking._id,
      user: booking.bookedby,
      provider,
      phoneNumber,
      amount,
      currency: provider === "mtn" ? (process.env.MTN_MOMO_CURRENCY || "EUR") : (process.env.AIRTEL_CURRENCY || "UGX"),
      transactionReference,
      status: "initiated",
    });

    let result;
    try {
      result = await adapter.initiate({
        amount,
        phoneNumber,
        transactionReference,
        description,
      });
    } catch (err) {
      logger.error(`[payments] adapter.initiate threw: ${err.message}`);
      payment.status = "failed";
      payment.statusReason = err.message;
      payment.rawInitiateResponse = { error: err.message };
      await payment.save();
      return res.status(502).json({ message: "Payment initiation failed", error: err.message });
    }

    payment.status = result.status === "successful" ? "successful" : result.status === "failed" ? "failed" : "pending";
    payment.statusReason = result.reason;
    payment.providerReference = result.providerReference;
    payment.rawInitiateResponse = result.raw;
    await payment.save();

    booking.paymentProvider = provider;
    booking.paymentReference = transactionReference;
    booking.paymentStatus = payment.status === "successful" ? "paid" : "pending";
    booking.amount = amount;
    await booking.save();

    if (payment.status === "successful") {
      await _onPaymentSuccess(payment, booking);
    } else if (payment.status === "failed") {
      await _onPaymentFailed(payment, booking);
    }

    res.status(202).json({
      message: "Payment initiated",
      payment: {
        id: payment._id,
        status: payment.status,
        transactionReference,
        provider,
      },
    });
  } catch (err) {
    logger.error("[payments] initiate failed", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/payments/:transactionReference/status
 * Polls the provider for the latest status. Updates the local record.
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionReference } = req.params;
    const payment = await Payment.findOne({ transactionReference });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (["successful", "failed", "cancelled"].includes(payment.status)) {
      return res.json({ payment });
    }

    const adapter = getPaymentAdapter(payment.provider);
    const result = await adapter.verify({ transactionReference });

    payment.status = result.status === "successful" ? "successful" : result.status === "failed" ? "failed" : "pending";
    payment.statusReason = result.reason ?? payment.statusReason;
    payment.providerReference = result.providerReference ?? payment.providerReference;
    payment.rawVerifyResponse = result.raw;
    await payment.save();

    if (payment.status === "successful" || payment.status === "failed") {
      const booking = await Booking.findById(payment.booking).populate({ path: "room", populate: { path: "hostel" } });
      if (booking) {
        if (payment.status === "successful") {
          booking.paymentStatus = "paid";
          booking.status = "confirmed";
        } else {
          booking.paymentStatus = "failed";
        }
        await booking.save();
        if (payment.status === "successful") await _onPaymentSuccess(payment, booking);
        else await _onPaymentFailed(payment, booking);
      }
    }

    res.json({ payment });
  } catch (err) {
    logger.error("[payments] status check failed", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Webhook handler: POST /api/payments/webhooks/:provider
 * Idempotent — same transactionReference processed twice is a no-op.
 */
export const handleWebhook = async (req, res) => {
  const { provider } = req.params;
  if (!["mtn", "airtel"].includes(provider)) {
    return res.status(404).json({ message: "Unknown provider" });
  }

  let adapter;
  try {
    adapter = getPaymentAdapter(provider);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }

  const rawBody = req.rawBody || JSON.stringify(req.body || {});
  const headers = req.headers || {};

  const sigOk = adapter.verifyWebhookSignature({ headers, rawBody });
  if (!sigOk) {
    logger.warn(`[payments:webhook:${provider}] signature verification failed`);
    return res.status(401).json({ message: "Invalid signature" });
  }

  const parsed = adapter.parseWebhook(rawBody);
  if (!parsed.transactionReference) {
    logger.warn(`[payments:webhook:${provider}] missing transactionReference in payload`);
    return res.status(400).json({ message: "Missing transactionReference" });
  }

  const payment = await Payment.findOne({ transactionReference: parsed.transactionReference });
  if (!payment) {
    logger.warn(`[payments:webhook:${provider}] unknown reference ${parsed.transactionReference}`);
    return res.status(200).json({ message: "Unknown reference (acknowledged)" });
  }

  // Idempotency: terminal status with the same outcome already processed
  if (
    payment.webhookProcessedAt &&
    ["successful", "failed", "cancelled"].includes(payment.status) &&
    payment.status === parsed.status
  ) {
    return res.status(200).json({ message: "Already processed" });
  }

  payment.status = parsed.status;
  payment.providerReference = parsed.providerReference || payment.providerReference;
  payment.statusReason = parsed.reason || payment.statusReason;
  payment.rawWebhookPayload = parsed.raw;
  payment.webhookProcessedAt = new Date();
  await payment.save();

  const booking = await Booking.findById(payment.booking).populate({ path: "room", populate: { path: "hostel" } });
  if (booking) {
    if (payment.status === "successful") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
    } else if (payment.status === "failed") {
      booking.paymentStatus = "failed";
    }
    await booking.save();
    if (payment.status === "successful") await _onPaymentSuccess(payment, booking);
    else if (payment.status === "failed") await _onPaymentFailed(payment, booking);
  }

  res.status(200).json({ message: "OK" });
};

async function _onPaymentSuccess(payment, booking) {
  // Mark the room unavailable and decrement the hostel's count.
  // Filter on isAvailable:true so a second call (webhook after poll) is a no-op.
  try {
    const roomId = booking.room?._id || booking.room;
    const flipped = await Room.findOneAndUpdate(
      { _id: roomId, isAvailable: true },
      { isAvailable: false },
      { new: true }
    );
    if (flipped) {
      await Hostel.findOneAndUpdate(
        { _id: flipped.hostel, availableRooms: { $gt: 0 } },
        { $inc: { availableRooms: -1 } }
      );
      logger.info(`[payments] room ${roomId} marked unavailable, hostel count decremented`);
    }
  } catch (err) {
    logger.error(`[payments] room availability update failed: ${err.message}`);
  }

  try {
    const user = booking.bookedby ? await User.findById(booking.bookedby).select("name email contact") : null;
    const hostel = booking.room?.hostel;
    const room = booking.room;
    await NotificationService.dispatch(EVENTS.PAYMENT_SUCCESSFUL, { user, payment: payment.toObject(), booking: booking.toObject(), hostel, room });
    await NotificationService.dispatch(EVENTS.BOOKING_CONFIRMED, { user, booking: booking.toObject(), hostel, room });
  } catch (err) {
    logger.error(`[payments] post-success notification failed: ${err.message}`);
  }
}

async function _onPaymentFailed(payment, booking) {
  try {
    const user = booking.bookedby ? await User.findById(booking.bookedby).select("name email contact") : null;
    await NotificationService.dispatch(EVENTS.PAYMENT_FAILED, { user, payment: payment.toObject(), booking: booking.toObject() });
  } catch (err) {
    logger.error(`[payments] post-failure notification failed: ${err.message}`);
  }
}
