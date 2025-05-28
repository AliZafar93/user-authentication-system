// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

const router = express.Router();

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields (name, email, password).' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Create new user instance
    user = new User({
      name,
      email,
      password,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    user.password = await bcrypt.hash(password, salt); // Hash the password

    await user.save(); // Save the user to the database

    // Optionally, you can create and send a token immediately upon signup
    // For this example, we'll just send a success message.
    // The user can then login to get a token.

    res.status(201).json({ message: 'User registered successfully. Please login.' });

  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password.' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (user not found).' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password incorrect).' });
    }

    // User matched, create JWT payload
    const payload = {
      id: user.id, // or user._id
      // You can add more data to the payload if needed, e.g., name, roles
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration (e.g., 1 hour, 3600 seconds)
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { // Send back some user info (excluding password)
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
