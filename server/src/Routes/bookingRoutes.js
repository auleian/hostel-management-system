import { Router } from "express";
import { createBooking, getAllBookings } from "../controllers/bookingController.js";

const router = Router();

router.post("/create", createBooking);
router.get("/getAll", getAllBookings);

export default router;
