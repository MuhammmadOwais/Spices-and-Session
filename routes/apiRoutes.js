const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const apiController = require('../controllers/apiController');

// Multer Disk Storage Configuration for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'));
  }
});

// Products API endpoints
router.get('/products', apiController.getProducts);
router.get('/products/:slug', apiController.getProductDetail);
router.post('/products', upload.single('imageFile'), apiController.createProduct);
router.put('/products/:id', upload.single('imageFile'), apiController.updateProduct);
router.delete('/products/:id', apiController.deleteProduct);

// Blogs API endpoints
router.get('/blogs', apiController.getBlogs);
router.get('/blogs/:slug', apiController.getBlogDetail);
router.post('/blogs', upload.single('imageFile'), apiController.createBlog);
router.put('/blogs/:id', upload.single('imageFile'), apiController.updateBlog);
router.delete('/blogs/:id', apiController.deleteBlog);

// Auth & Checkout APIs
router.post('/auth/login', apiController.adminLogin);
router.post('/checkout', apiController.processCheckout);

module.exports = router;
