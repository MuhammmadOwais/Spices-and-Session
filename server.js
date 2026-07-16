const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoutes');
const compression = require('compression');

const app = express();

// Apply response compression middleware for fast assets delivery
app.use(compression());

// Ensure upload and assets directories exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
const cssDir = path.join(__dirname, 'public', 'css');
const jsDir = path.join(__dirname, 'public', 'js');
const imagesDir = path.join(__dirname, 'public', 'images');

[uploadDir, cssDir, jsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Database Connection
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('Successfully connected to MongoDB Atlas.'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Skipping direct DB connection: MONGODB_URI not provided.');
}

// View Engine Setup & Cache
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', true); // Cache EJS compiled templates in production/staging

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static assets with browser caching headers (7 days cache)
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretspicehavenkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Setup Global variables for template rendering
app.use((req, res, next) => {
  res.locals.isAdminUser = req.session.isAdmin || false;
  res.locals.path = req.path;
  next();
});

// Routes
app.use('/', shopRoutes);
app.use('/admin', adminRoutes);

// Custom 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found | Spicery Co.',
    path: req.path
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Spicery Co. server running at http://localhost:${PORT}`);
});

module.exports = app; // Export app for Vercel serverless integration
