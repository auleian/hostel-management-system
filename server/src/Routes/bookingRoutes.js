import { Router } from "express";
import { createBooking, getAllBookings } from "../controllers/bookingController.js";

const router = Router();

router.post("/", createBooking);
router.get("/", getAllBookings);

export default router;
