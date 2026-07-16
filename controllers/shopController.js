const Product = require('../models/Product');
const Blog = require('../models/Blog');

exports.getHome = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(4);
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
    res.render('home', {
      title: 'Artisan Spice Co. | Premium Spices & Seasonings',
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
      query.category = category;
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
      title: 'Shop Premium Spices | Artisan Spice Co.',
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
      title: `${product.name} | Artisan Spice Co.`,
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
      title: 'Aromatic Journal | Artisan Spice Co.',
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
      title: `${blog.title} | Artisan Spice Co.`,
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
    title: 'Our Story | Artisan Spice Co.',
    path: '/about'
  });
};

exports.getPrivacy = (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy Policy | Artisan Spice Co.',
    path: '/privacy-policy'
  });
};

exports.getTerms = (req, res) => {
  res.render('terms-conditions', {
    title: 'Terms of Service | Artisan Spice Co.',
    path: '/terms-conditions'
  });
};

exports.getCart = (req, res) => {
  res.render('cart', {
    title: 'Your Cart | Artisan Spice Co.',
    path: '/cart'
  });
};

exports.getCheckout = (req, res) => {
  res.render('checkout', {
    title: 'Checkout | Artisan Spice Co.',
    path: '/checkout'
  });
};

exports.postCheckout = (req, res) => {
  const { name, email, address, city, zip } = req.body;
  res.render('checkout-success', {
    title: 'Order Confirmed! | Artisan Spice Co.',
    path: '/checkout',
    orderInfo: { name, email, address, city, zip }
  });
};
