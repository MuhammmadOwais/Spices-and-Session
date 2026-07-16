const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { ensureAdmin } = require('../middleware/auth');

// Multer Disk Storage Configuration
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

// Admin Authentication
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected Dashboard
router.get('/', ensureAdmin, adminController.getDashboard);

// Protected Product CRUD Routes
router.get('/products', ensureAdmin, adminController.getProducts);
router.get('/products/new', ensureAdmin, adminController.getNewProduct);
router.post('/products', ensureAdmin, upload.single('imageFile'), adminController.postCreateProduct);
router.get('/products/:id/edit', ensureAdmin, adminController.getEditProduct);
router.post('/products/:id', ensureAdmin, upload.single('imageFile'), adminController.postUpdateProduct);
router.post('/products/:id/delete', ensureAdmin, adminController.postDeleteProduct);

// Protected Blog CRUD Routes
router.get('/blogs', ensureAdmin, adminController.getBlogs);
router.get('/blogs/new', ensureAdmin, adminController.getNewBlog);
router.post('/blogs', ensureAdmin, upload.single('imageFile'), adminController.postCreateBlog);
router.get('/blogs/:id/edit', ensureAdmin, adminController.getEditBlog);
router.post('/blogs/:id', ensureAdmin, upload.single('imageFile'), adminController.postUpdateBlog);
router.post('/blogs/:id/delete', ensureAdmin, adminController.postDeleteBlog);

module.exports = router;
