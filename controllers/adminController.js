const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');

// --- Auth Operations ---

exports.getLogin = (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Admin Login | Artisan Spice Co.',
    error: req.query.error || null,
    msg: req.query.msg || null,
    path: '/admin/login'
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.render('admin/login', {
        title: 'Admin Login | Artisan Spice Co.',
        error: 'Invalid username or password',
        msg: null,
        path: '/admin/login'
      });
    }
    
    req.session.isAdmin = true;
    res.redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/admin/login?msg=Logged out successfully');
  });
};

// --- Dashboard ---

exports.getDashboard = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const blogCount = await Blog.countDocuments();
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard | Artisan Spice Co.',
      productCount,
      blogCount,
      path: '/admin'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

// --- Product CRUD ---

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/products', {
      title: 'Manage Products | Artisan Spice Co.',
      products,
      path: '/admin/products'
    });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getNewProduct = (req, res) => {
  res.render('admin/product-form', {
    title: 'Add New Product | Artisan Spice Co.',
    product: {},
    isEdit: false,
    path: '/admin/products'
  });
};

exports.postCreateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, imageUrl, ingredients, isFeatured, stockStatus } = req.body;
    
    let finalImageUrl = imageUrl || '/images/spice-placeholder.jpg';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const sizeArray = sizes 
      ? sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : ['2 oz Jar', '4 oz Flatpack', '1 lb Bulk'];

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      sizes: sizeArray,
      imageUrl: finalImageUrl,
      ingredients,
      isFeatured: isFeatured === 'on',
      stockStatus: stockStatus || 'in-stock'
    });

    await newProduct.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('admin/product-form', {
      title: `Edit Product - ${product.name} | Artisan Spice Co.`,
      product,
      isEdit: true,
      path: '/admin/products'
    });
  } catch (error) {
    console.error('Edit product form error:', error);
    res.status(500).send('Server Error');
  }
};

exports.postUpdateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, imageUrl, ingredients, isFeatured, stockStatus } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).send('Product not found');
    }

    let finalImageUrl = imageUrl || product.imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const sizeArray = sizes 
      ? sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : product.sizes;

    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    product.category = category;
    product.sizes = sizeArray;
    product.imageUrl = finalImageUrl;
    product.ingredients = ingredients;
    product.isFeatured = isFeatured === 'on';
    product.stockStatus = stockStatus;

    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).send('Server Error');
  }
};

exports.postDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).send('Server Error');
  }
};

// --- Blog CRUD ---

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('admin/blogs', {
      title: 'Manage Blogs | Artisan Spice Co.',
      blogs,
      path: '/admin/blogs'
    });
  } catch (error) {
    console.error('Admin get blogs error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getNewBlog = (req, res) => {
  res.render('admin/blog-form', {
    title: 'Create Blog Post | Artisan Spice Co.',
    blog: {},
    isEdit: false,
    path: '/admin/blogs'
  });
};

exports.postCreateBlog = async (req, res) => {
  try {
    const { title, subtitle, content, author, category, imageUrl, readTime } = req.body;
    
    let finalImageUrl = imageUrl || '/images/blog-placeholder.jpg';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const newBlog = new Blog({
      title,
      subtitle,
      content,
      author: author || 'Artisan Spice Staff',
      category: category || 'Recipes & Guides',
      imageUrl: finalImageUrl,
      readTime: parseInt(readTime) || 5
    });

    await newBlog.save();
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }
    res.render('admin/blog-form', {
      title: `Edit Blog - ${blog.title} | Artisan Spice Co.`,
      blog,
      isEdit: true,
      path: '/admin/blogs'
    });
  } catch (error) {
    console.error('Edit blog form error:', error);
    res.status(500).send('Server Error');
  }
};

exports.postUpdateBlog = async (req, res) => {
  try {
    const { title, subtitle, content, author, category, imageUrl, readTime } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }

    let finalImageUrl = imageUrl || blog.imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    blog.title = title;
    blog.subtitle = subtitle;
    blog.content = content;
    blog.author = author;
    blog.category = category;
    blog.imageUrl = finalImageUrl;
    blog.readTime = parseInt(readTime) || 5;

    await blog.save();
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).send('Server Error');
  }
};

exports.postDeleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).send('Server Error');
  }
};
