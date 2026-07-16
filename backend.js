const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Database Connection
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('Backend connected to MongoDB Atlas successfully.'))
  .catch(err => console.error('Backend MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files directly
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api', apiRoutes);

// Custom API 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Artisan Spice Co. Backend API running at http://localhost:${PORT}`);
});
