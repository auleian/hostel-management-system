import { Router } from "express";
import { createBooking, getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.patch("/:id", updateBookingStatus);

export default router;
