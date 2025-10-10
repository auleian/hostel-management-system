const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

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
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// example protected route
router.get('/me', auth, async (req, res) => {
  const User = require('/models/User');
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
