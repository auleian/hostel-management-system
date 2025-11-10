import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from "../models/User.js";


const generateToken = (id) =>
  // fallback secret for local development to avoid crashes when env var is missing
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password , contact, userType } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

  // map incoming `contact` to the User schema's `telephone` field
  user = new User({ name, email, password, telephone: contact, userType: userType || 'student' });
    await user.save();

    const token = generateToken(user._id);

    // Option A: Return token in response body
    // Here: we'll return token and also set httpOnly cookie (optional)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, telephone: user.telephone, userType: user.userType }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ msg: 'User not found' });
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // Prevent caches or proxies from returning 304/empty bodies for auth endpoints
    res.set('Cache-Control', 'no-store');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const checkAdmin = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ isAdmin: false });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ isAdmin: false });
    const isAdmin = user.userType === 'admin' || user.isAdmin === true;
    // Prevent caches or proxies from returning 304/empty bodies for auth endpoints
    res.set('Cache-Control', 'no-store');
    res.json({ isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
