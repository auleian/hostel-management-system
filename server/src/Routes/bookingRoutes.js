import { Router } from "express";
import { createBooking } from "../controllers/booking.js";

const router = Router();

router.post("/createBooking", createBooking);

export default router;
