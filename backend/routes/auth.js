const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
  // Mock user
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ user }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch {
      res.status(500).json({ message: 'Error logging in' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
