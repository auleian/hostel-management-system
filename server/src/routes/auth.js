import express from 'express';
import { check } from 'express-validator';
import {
  register,
  login,
  getCurrentUser,
  isAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';


const router = express.Router();


router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    // simplified: only require name/email/password on register; other fields are optional
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// current user
router.get('/me', protect, getCurrentUser);

// check admin flag
router.get('/check-admin', protect, isAdmin);

export default router;
