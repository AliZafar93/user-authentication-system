const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Flight = require('../models/Flight');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching flights', error: err.message });
  }
});


router.post('/excel-upload', async (req, res) => {
  try {
    if (!req.body || !req.body.flightsData) {
      return res.status(400).json({
        success: false,
        message: 'No flight data provided'
      });
    }

    const { flightsData } = req.body;
    console.log('flight data : ', flightsData)

    if (!Array.isArray(flightsData) || flightsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Flight data must be a non-empty array'
      });
    }

    const result = await Flight.insertMany(flightsData);

    res.status(201).json({
      success: true,
      message: 'Flight data uploaded successfully',
      data: {
        insertedCount: result.length,
        insertedIds: result.map(f => f._id)
      }
    });

  } catch (err) {
    console.error('Error uploading flight data:', err);

    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading flight data',
      error: err.message
    });
  }
});

module.exports = router;
