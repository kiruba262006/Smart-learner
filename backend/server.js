// Load environment variables from .env file (if you use one for MONGO_URI)
require('dotenv').config();

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const path = require('path');
const cors = require('cors');

// Create an Express application instance
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection URI
// Use your local MongoDB URI. 'nocorps_app_db' will be the database name.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nocorps_app_db';

// Middleware: Used to parse JSON bodies from incoming requests
app.use(express.json());
// Enable CORS for all origins (for development). In production, restrict this to your frontend domain.
app.use(cors());

// --- MongoDB Connection ---
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully! 🎉');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
}

connectDB(); // Call the function to connect to MongoDB

// --- API Routes ---
// Import authentication routes and post routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Use authentication routes under the /api/auth path
app.use('/api/auth', authRoutes.router); // authRoutes.js exports an object with 'router'
// Use post routes under the /api/posts path
app.use('/api/posts', postRoutes); // postRoutes.js exports the router directly

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));