const express = require('express');
const router = express.Router();

// In-memory user store (for demo purposes)
const users = [];

// Registration endpoint
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  // Check if user already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  // Add user
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully.' });
});

module.exports = router;
