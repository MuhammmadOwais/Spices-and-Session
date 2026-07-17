const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Home Route
router.get('/', shopController.getHome);

// Shop / Product Routes
router.get('/products', shopController.getProducts);
router.get('/products/:slug', shopController.getProductDetail);

// Blog Routes
router.get('/blogs', shopController.getBlogs);
router.get('/blogs/:slug', shopController.getBlogDetail);

// Recipe Routes
router.get('/recipes', shopController.getRecipes);
router.get('/recipes/:slug', shopController.getRecipeDetail);

// Static Content Routes
router.get('/about', shopController.getAbout);
router.get('/privacy-policy', shopController.getPrivacy);
router.get('/terms-conditions', shopController.getTerms);

// User Authentication Routes
router.get('/signup', shopController.getSignup);
router.post('/signup', shopController.postSignup);
router.get('/login', shopController.getLogin);
router.post('/login', shopController.postLogin);
router.get('/logout', shopController.getLogout);
router.get('/forgot-password', shopController.getForgotPassword);
router.post('/forgot-password', shopController.postForgotPassword);

// Live Search API Endpoint
router.get('/api/search', shopController.apiSearch);

module.exports = router;
