// backend/routes/personalInfo.js

const express = require('express');
const PersonalInfo = require('../models/PersonalInfo'); // Ensure path is correct
const authMiddleware = require('../middleware/auth'); // Auth middleware

const router = express.Router();

// Apply auth middleware to all routes in this file
// This means only authenticated users can access these routes
router.use(authMiddleware);

// @route   GET api/personal
// @desc    Get all personal info for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    // req.user.id is available from the authMiddleware
    const personalInfoList = await PersonalInfo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(personalInfoList);
  } catch (err) {
    console.error('Get PersonalInfo Error:', err.message);
    res.status(500).json({ message: 'Server error while fetching personal information.' });
  }
});

// @route   POST api/personal
// @desc    Add new personal info for the logged-in user
// @access  Private
router.post('/', async (req, res) => {
  const { firstName, lastName, address, phone } = req.body;

  // Basic validation
  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and last name are required.' });
  }

  try {
    const newPersonalInfo = new PersonalInfo({
      firstName,
      lastName,
      address,
      phone,
      user: req.user.id, // Link to the logged-in user
    });

    const savedPersonalInfo = await newPersonalInfo.save();
    res.status(201).json(savedPersonalInfo);
  } catch (err) {
    console.error('Create PersonalInfo Error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error while creating personal information.' });
  }
});

// @route   PUT api/personal/:id
// @desc    Update personal info for the logged-in user
// @access  Private
router.put('/:id', async (req, res) => {
  const { firstName, lastName, address, phone } = req.body;
  const { id: personalInfoId } = req.params; // ID of the PersonalInfo document to update

  // Build fields to update
  const updatedFields = {};
  if (firstName) updatedFields.firstName = firstName;
  if (lastName) updatedFields.lastName = lastName;
  if (address !== undefined) updatedFields.address = address; // Allow empty string for address
  if (phone !== undefined) updatedFields.phone = phone;     // Allow empty string for phone

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields to update provided.' });
  }
   // Ensure firstName and lastName are not being cleared if they are required and were previously set
  if (updatedFields.firstName === '' || updatedFields.lastName === '') {
    return res.status(400).json({ message: 'First name and last name cannot be empty.' });
  }


  try {
    let personalInfo = await PersonalInfo.findById(personalInfoId);

    if (!personalInfo) {
      return res.status(404).json({ message: 'Personal information not found.' });
    }

    // Check if the logged-in user owns this personal info
    if (personalInfo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this information.' });
    }

    personalInfo = await PersonalInfo.findByIdAndUpdate(
      personalInfoId,
      { $set: updatedFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    res.json(personalInfo);
  } catch (err) {
    console.error('Update PersonalInfo Error:', err.message);
     if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Personal information not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating personal information.' });
  }
});

// @route   DELETE api/personal/:id
// @desc    Delete personal info for the logged-in user
// @access  Private
router.delete('/:id', async (req, res) => {
  const { id: personalInfoId } = req.params;

  try {
    const personalInfo = await PersonalInfo.findById(personalInfoId);

    if (!personalInfo) {
      return res.status(404).json({ message: 'Personal information not found.' });
    }

    // Check if the logged-in user owns this personal info
    if (personalInfo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this information.' });
    }

    await PersonalInfo.findByIdAndDelete(personalInfoId);

    res.json({ message: 'Personal information deleted successfully.' });
  } catch (err) {
    console.error('Delete PersonalInfo Error:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Personal information not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting personal information.' });
  }
});

module.exports = router;
