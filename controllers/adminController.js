const axios = require('axios');
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

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
    
    // Validate credentials on Backend
    const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    
    if (response.data && response.data.success) {
      req.session.isAdmin = true;
      return res.redirect('/admin');
    }
    
    res.render('admin/login', {
      title: 'Admin Login | Artisan Spice Co.',
      error: 'Invalid username or password',
      msg: null,
      path: '/admin/login'
    });
  } catch (error) {
    console.error('Admin login call error:', error.message);
    res.render('admin/login', {
      title: 'Admin Login | Artisan Spice Co.',
      error: 'Invalid admin credentials or backend server offline',
      msg: null,
      path: '/admin/login'
    });
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
    const productCountRes = await axios.get(`${API_URL}/api/products`);
    const blogCountRes = await axios.get(`${API_URL}/api/blogs`);
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard | Artisan Spice Co.',
      productCount: productCountRes.data.length,
      blogCount: blogCountRes.data.length,
      path: '/admin'
    });
  } catch (error) {
    console.error('Dashboard api calls error:', error.message);
    res.status(500).send('Server Error: Backend API might be offline');
  }
};

// --- Product CRUD ---

exports.getProducts = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    res.render('admin/products', {
      title: 'Manage Products | Artisan Spice Co.',
      products: response.data,
      path: '/admin/products'
    });
  } catch (error) {
    console.error('Admin list products error:', error.message);
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

    await axios.post(`${API_URL}/api/products`, {
      name,
      description,
      price,
      category,
      sizes,
      imageUrl: finalImageUrl,
      ingredients,
      isFeatured: isFeatured === 'on' ? 'true' : 'false',
      stockStatus
    });

    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product API post error:', error.message);
    res.status(500).send('Failed to create product');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    // Find the product by checking slug / ID (API returns all products)
    const product = response.data.find(p => p._id === req.params.id);
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
    console.error('Edit product form error:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.postUpdateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, imageUrl, ingredients, isFeatured, stockStatus } = req.body;
    
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    await axios.put(`${API_URL}/api/products/${req.params.id}`, {
      name,
      description,
      price,
      category,
      sizes,
      imageUrl: finalImageUrl,
      ingredients,
      isFeatured: isFeatured === 'on',
      stockStatus
    });

    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product API call error:', error.message);
    res.status(500).send('Failed to update product');
  }
};

exports.postDeleteProduct = async (req, res) => {
  try {
    await axios.delete(`${API_URL}/api/products/${req.params.id}`);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product API error:', error.message);
    res.status(500).send('Failed to delete product');
  }
};

// --- Blog CRUD ---

exports.getBlogs = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    res.render('admin/blogs', {
      title: 'Manage Blogs | Artisan Spice Co.',
      blogs: response.data,
      path: '/admin/blogs'
    });
  } catch (error) {
    console.error('Admin list blogs error:', error.message);
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

    await axios.post(`${API_URL}/api/blogs`, {
      title,
      subtitle,
      content,
      author,
      category,
      imageUrl: finalImageUrl,
      readTime
    });

    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Create blog API post error:', error.message);
    res.status(500).send('Failed to publish article');
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    const blog = response.data.find(b => b._id === req.params.id);
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
    console.error('Edit blog form error:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.postUpdateBlog = async (req, res) => {
  try {
    const { title, subtitle, content, author, category, imageUrl, readTime } = req.body;
    
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    await axios.put(`${API_URL}/api/blogs/${req.params.id}`, {
      title,
      subtitle,
      content,
      author,
      category,
      imageUrl: finalImageUrl,
      readTime
    });

    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Update blog API put error:', error.message);
    res.status(500).send('Failed to update article');
  }
};

exports.postDeleteBlog = async (req, res) => {
  try {
    await axios.delete(`${API_URL}/api/blogs/${req.params.id}`);
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Delete blog API error:', error.message);
    res.status(500).send('Failed to delete blog post');
  }
};
