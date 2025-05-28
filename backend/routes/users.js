// backend/routes/users.js
// This file seems to be for general user management, potentially for an admin.
// The auth routes (signup/login) are in auth.js.
// The PDF shows CRUD operations here, which might be for admin purposes or a user profile page
// that allows users to update their own 'name', 'email', 'age'.
// For simplicity and security, direct password updates should be handled with care (e.g., separate "change password" flow).

const express = require('express');
const User = require('../models/User'); // Ensure path is correct
const bcrypt = require('bcryptjs'); // Needed if password can be updated here
// const authMiddleware = require('../middleware/auth'); // Optional: protect these routes

const router = express.Router();

// router.use(authMiddleware); // Uncomment if these routes should be protected

// @route   GET api/users
// @desc    Get all users (Consider admin-only access for this)
// @access  Protected/Admin (if authMiddleware is used and checks role) or Public (as per PDF snippet)
router.get('/', async (req, res) => {
  try {
    // Excluding password from the result for security
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error:', err.message);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID (Consider admin or self access)
// @access  Protected/Admin or Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(`GET /api/users/${req.params.id} error:`, err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
});

// @route   POST api/users
// @desc    Create a new user (This is similar to signup, usually handled by /api/auth/signup)
//          The PDF includes this, perhaps for admin user creation.
//          If used, ensure password hashing.
// @access  Admin or Public (as per PDF snippet)
router.post('/', async (req, res) => {
  const { name, email, password, age } = req.body; // 'age' is from PDF snippet for this route

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = new User({
      name,
      email,
      password,
      // age // Add age if it's part of your User model and you want to set it here
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const savedUser = await newUser.save();
    // Exclude password from the response
    const userToReturn = savedUser.toObject();
    delete userToReturn.password;

    res.status(201).json(userToReturn);
  } catch (err) {
    console.error('POST /api/users error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error while creating user.' });
  }
});

// @route   PUT api/users/:id
// @desc    Update user by ID (e.g., for profile update or admin)
// @access  Protected (self or admin)
router.put('/:id', async (req, res) => {
  const { name, email, age } = req.body; // Password updates should be handled separately and carefully
  const { id: userId } = req.params;

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (email) fieldsToUpdate.email = email;
  // if (age !== undefined) fieldsToUpdate.age = age; // Add age if in your model

  // Basic validation: ensure not trying to set critical fields to empty if they are required
  if (fieldsToUpdate.name === '') return res.status(400).json({ message: 'Name cannot be empty.' });
  if (fieldsToUpdate.email === '') return res.status(400).json({ message: 'Email cannot be empty.' });


  // If allowing email updates, consider re-verification or checking for uniqueness again.
  // For simplicity, this example doesn't re-hash password here.
  // If password update is allowed via this route (not recommended without current password check):
  // if (password) {
  //   const salt = await bcrypt.genSalt(10);
  //   fieldsToUpdate.password = await bcrypt.hash(password, salt);
  // }

  try {
    // Optional: Check if the user making the request is the user being updated or an admin
    // if (req.user.id !== userId && !req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Not authorized to update this user.' });
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(`PUT /api/users/${userId} error:`, err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) { // MongoDB duplicate key error (e.g. if email is changed to an existing one)
        return res.status(400).json({ message: 'Email already in use by another account.' });
    }
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating user.' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user by ID (Typically admin-only)
// @access  Protected (Admin)
router.delete('/:id', async (req, res) => {
  const { id: userId } = req.params;
  try {
    // Optional: Check if the user making the request is an admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Not authorized to delete users.' });
    // }
    // Also, consider what happens to related data (e.g., PersonalInfo) when a user is deleted.

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Optionally, delete related PersonalInfo records
    // await PersonalInfo.deleteMany({ user: userId });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(`DELETE /api/users/${userId} error:`, err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
});

module.exports = router;
