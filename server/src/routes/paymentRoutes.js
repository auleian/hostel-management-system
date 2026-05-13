import { Router } from "express";
import { getProviders, initiatePayment, checkPaymentStatus, handleWebhook } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Public — let the client know which providers are available
router.get("/providers", getProviders);

// Webhooks must be unauthenticated (providers don't carry our JWTs)
router.post("/webhooks/:provider", handleWebhook);

// Authenticated payment actions
router.post("/initiate", protect, initiatePayment);
router.get("/:transactionReference/status", protect, checkPaymentStatus);

export default router;
