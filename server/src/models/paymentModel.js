import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    provider: {
      type: String,
      enum: ["mtn", "airtel"],
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "UGX",
    },
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    providerReference: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["initiated", "pending", "successful", "failed", "cancelled"],
      default: "initiated",
      index: true,
    },
    statusReason: {
      type: String,
      default: null,
    },
    rawInitiateResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    rawWebhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    rawVerifyResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    webhookProcessedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
