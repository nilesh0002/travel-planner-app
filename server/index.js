/**
 * TRAVEL PLANNER BACKEND
 * Simple Express server for managing trips and itineraries.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route imports
const tripRoutes = require('./routes/tripRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic Middleware
app.use(cors());              // Allow requests from React frontend
app.use(express.json());      // Parse JSON bodies

// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Travel Planner API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

