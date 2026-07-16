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

// Static Content Routes
router.get('/about', shopController.getAbout);
router.get('/privacy-policy', shopController.getPrivacy);
router.get('/terms-conditions', shopController.getTerms);

// Cart & Checkout Simulation Routes
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.post('/checkout', shopController.postCheckout);

module.exports = router;
