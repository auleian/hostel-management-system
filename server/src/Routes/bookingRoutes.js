import { Router } from "express";
import { createBooking } from "../controllers/booking";

const router = Router();

router.post("/createBooking", createBooking);

export default router;
