import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  login
);

router.get("/me", auth, me);

export default router;