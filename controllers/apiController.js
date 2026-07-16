const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');

// --- Products API ---

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, limit, featured } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'name-asc') sortObj = { name: 1 };
    else if (sort === 'name-desc') sortObj = { name: -1 };

    let queryExec = Product.find(query).sort(sortObj);
    if (limit) {
      queryExec = queryExec.limit(parseInt(limit));
    }

    const products = await queryExec;
    res.json(products);
  } catch (error) {
    console.error('API get products error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('API get product detail error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

exports.createProduct = async (req, res) => {
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
      isFeatured: isFeatured === 'true' || isFeatured === 'on',
      stockStatus: stockStatus || 'in-stock'
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('API create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, imageUrl, ingredients, isFeatured, stockStatus } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
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
    product.isFeatured = isFeatured === 'true' || isFeatured === 'on' || isFeatured === true;
    product.stockStatus = stockStatus;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('API update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('API delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// --- Blogs API ---

exports.getBlogs = async (req, res) => {
  try {
    const { limit } = req.query;
    let queryExec = Blog.find().sort({ createdAt: -1 });
    if (limit) {
      queryExec = queryExec.limit(parseInt(limit));
    }
    const blogs = await queryExec;
    res.json(blogs);
  } catch (error) {
    console.error('API get blogs error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

exports.getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('API get blog detail error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

exports.createBlog = async (req, res) => {
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
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('API create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, subtitle, content, author, category, imageUrl, readTime } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
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
    res.json(blog);
  } catch (error) {
    console.error('API update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('API delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// --- Auth & Checkout API ---

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    res.json({ success: true, message: 'Authentication successful' });
  } catch (error) {
    console.error('API auth error:', error);
    res.status(500).json({ error: 'Authentication process failed' });
  }
};

exports.processCheckout = (req, res) => {
  // Simulator validation logic
  const { name, email, address, city, zip } = req.body;
  if (!name || !email || !address) {
    return res.status(400).json({ error: 'Missing required checkout information' });
  }
  res.json({ success: true, order: { name, email, address, city, zip } });
};
