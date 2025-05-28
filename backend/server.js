// backend/server.js


require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route files
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const personalInfoRoutes = require('./routes/personalInfo');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1); // Exit if DB connection string is missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,      // Deprecated, but often in older examples. Modern drivers handle this.
  useUnifiedTopology: true, // Deprecated, but often in older examples. Modern drivers handle this.
  // Mongoose 6+ no longer needs these options, they are default.
  // For Mongoose 5 or older, keep them.
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit if DB connection fails
});

// API Routes
app.get('/', (req, res) => { // Simple route for root path to check if server is up
    res.send('API is running...');
});
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/personal', personalInfoRoutes); // As per manual: /api/personal

// Global error handler (optional basic example)
app.use((err, req, res, next) => {
  console.error("Unhandled application error:", err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
