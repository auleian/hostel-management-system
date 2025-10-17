import express from 'express';
import { check } from 'express-validator';
import {
  register,
  login
} from '../controllers/authController.js';


const router = express.Router();


router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('university', 'University is required').notEmpty(),
    check('contact', 'Contact is required').notEmpty(),
    check('nextOfKin.name', 'Next of kin name is required').notEmpty(),
    check('nextOfKin.contact', 'Next of kin contact is required').notEmpty()
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

export default router;
