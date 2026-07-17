const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.getHome = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(4);
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
    res.render('home', {
      title: 'Spicery Co. | Premium Spices & Seasonings',
      featuredProducts,
      latestBlogs,
      path: '/'
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Server Error');
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};
    
    if (category && category !== '') {
      query.$or = [
        { mainCategoryGroup: category },
        { category: category },
        { subCategory: category }
      ];
    }
    
    if (search && search !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 };
    } else if (sort === 'name-asc') {
      sortObj = { name: 1 };
    } else if (sort === 'name-desc') {
      sortObj = { name: -1 };
    }

    const products = await Product.find(query).sort(sortObj);
    
    res.render('products', {
      title: 'Shop Premium Spices | Spicery Co.',
      products,
      selectedCategory: category || '',
      searchQuery: search || '',
      selectedSort: sort || '',
      path: '/products'
    });
  } catch (error) {
    console.error('Error rendering products page:', error);
    res.status(500).send('Server Error');
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).render('404', { title: 'Product Not Found', path: '/products' });
    }
    
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.render('product-detail', {
      title: `${product.name} | Spicery Co.`,
      product,
      relatedProducts,
      path: '/products'
    });
  } catch (error) {
    console.error('Error rendering product detail:', error);
    res.status(500).send('Server Error');
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('blogs', {
      title: 'Aromatic Journal | Spicery Co.',
      blogs,
      path: '/blogs'
    });
  } catch (error) {
    console.error('Error rendering blogs page:', error);
    res.status(500).send('Server Error');
  }
};

exports.getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).render('404', { title: 'Blog Post Not Found', path: '/blogs' });
    }
    
    res.render('blog-detail', {
      title: `${blog.title} | Spicery Co.`,
      blog,
      path: '/blogs'
    });
  } catch (error) {
    console.error('Error rendering blog post detail:', error);
    res.status(500).send('Server Error');
  }
};

exports.getAbout = (req, res) => {
  res.render('about', {
    title: 'Our Story | Spicery Co.',
    path: '/about'
  });
};

exports.getPrivacy = (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy Policy | Spicery Co.',
    path: '/privacy-policy'
  });
};

exports.getTerms = (req, res) => {
  res.render('terms-conditions', {
    title: 'Terms of Service | Spicery Co.',
    path: '/terms-conditions'
  });
};

exports.apiSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(6);
    res.json(products);
  } catch (error) {
    console.error('Live search API error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.render('recipes', {
      title: 'Culinary Master Recipes | Spicery Co.',
      path: '/recipes',
      recipes: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).send('Server Error');
  }
};

exports.getRecipeDetail = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug });
    if (!recipe) {
      return res.status(404).send('Recipe Not Found');
    }
    res.render('recipe-detail', {
      title: `${recipe.title} Recipe | Spicery Co.`,
      path: '/recipes',
      recipe: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe detail:', error);
    res.status(500).send('Server Error');
  }
};

// --- User Authentication Controllers ---

exports.getSignup = (req, res) => {
  res.render('signup', {
    title: 'Create Account | Spicery Co.',
    path: '/signup',
    error: null
  });
};

exports.postSignup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    if (!email || !password) {
      return res.render('signup', {
        title: 'Create Account | Spicery Co.',
        path: '/signup',
        error: 'Please fill in all fields.'
      });
    }

    if (password !== confirmPassword) {
      return res.render('signup', {
        title: 'Create Account | Spicery Co.',
        path: '/signup',
        error: 'Passwords do not match.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', {
        title: 'Create Account | Spicery Co.',
        path: '/signup',
        error: 'An account with this email already exists.'
      });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.userEmail = newUser.email;
    res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Sign In | Spicery Co.',
    path: '/login',
    error: null
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('login', {
        title: 'Sign In | Spicery Co.',
        path: '/login',
        error: 'Please enter email and password.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        title: 'Sign In | Spicery Co.',
        path: '/login',
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', {
        title: 'Sign In | Spicery Co.',
        path: '/login',
        error: 'Invalid email or password.'
      });
    }

    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout session destroy error:', err);
    }
    res.redirect('/');
  });
};

exports.getForgotPassword = (req, res) => {
  res.render('forgot-password', {
    title: 'Reset Password | Spicery Co.',
    path: '/login',
    error: null,
    success: null
  });
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('forgot-password', {
        title: 'Reset Password | Spicery Co.',
        path: '/login',
        error: 'No user registered with this email address.',
        success: null
      });
    }

    // Generate random temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + 'Sp!ce';
    
    user.password = tempPassword;
    await user.save();

    console.log(`[MOCK EMAIL SERVICE] To: ${email} -> Subject: Reset Password -> Content: Your temporary Spicery Co. password has been reset to: ${tempPassword}`);

    res.render('forgot-password', {
      title: 'Reset Password | Spicery Co.',
      path: '/login',
      error: null,
      success: `We have sent a temporary password reset email to ${email}! (Mock demonstration: your password has been reset to: ${tempPassword})`
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact Us | Spicery Co.',
    path: '/contact'
  });
};

