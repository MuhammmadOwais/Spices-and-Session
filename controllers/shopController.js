const axios = require('axios');
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

exports.getHome = async (req, res) => {
  try {
    const featuredRes = await axios.get(`${API_URL}/api/products?featured=true&limit=4`);
    const blogsRes = await axios.get(`${API_URL}/api/blogs?limit=3`);
    
    res.render('home', {
      title: 'Artisan Spice Co. | Premium Spices & Seasonings',
      featuredProducts: featuredRes.data,
      latestBlogs: blogsRes.data,
      path: '/'
    });
  } catch (error) {
    console.error('Error rendering home page:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    const response = await axios.get(`${API_URL}/api/products`, {
      params: { category, search, sort }
    });
    
    res.render('products', {
      title: 'Shop Premium Spices | Artisan Spice Co.',
      products: response.data,
      selectedCategory: category || '',
      searchQuery: search || '',
      selectedSort: sort || '',
      path: '/products'
    });
  } catch (error) {
    console.error('Error rendering products page:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const productRes = await axios.get(`${API_URL}/api/products/${req.params.slug}`);
    const product = productRes.data;
    
    const relatedRes = await axios.get(`${API_URL}/api/products`, {
      params: { category: product.category }
    });
    
    // Filter out current product
    const relatedProducts = relatedRes.data
      .filter(p => p._id !== product._id)
      .slice(0, 4);

    res.render('product-detail', {
      title: `${product.name} | Artisan Spice Co.`,
      product,
      relatedProducts,
      path: '/products'
    });
  } catch (error) {
    console.error('Error rendering product detail:', error.message);
    res.status(404).render('404', { title: 'Product Not Found', path: '/products' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
    
    res.render('blogs', {
      title: 'Aromatic Journal | Artisan Spice Co.',
      blogs: response.data,
      path: '/blogs'
    });
  } catch (error) {
    console.error('Error rendering blogs page:', error.message);
    res.status(500).send('Server Error');
  }
};

exports.getBlogDetail = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs/${req.params.slug}`);
    
    res.render('blog-detail', {
      title: `${response.data.title} | Artisan Spice Co.`,
      blog: response.data,
      path: '/blogs'
    });
  } catch (error) {
    console.error('Error rendering blog post detail:', error.message);
    res.status(404).render('404', { title: 'Blog Post Not Found', path: '/blogs' });
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

exports.postCheckout = async (req, res) => {
  try {
    const { name, email, address, city, zip, cardName, cardNumber } = req.body;
    
    const response = await axios.post(`${API_URL}/api/checkout`, {
      name, email, address, city, zip, cardName, cardNumber
    });
    
    res.render('checkout-success', {
      title: 'Order Confirmed! | Artisan Spice Co.',
      path: '/checkout',
      orderInfo: response.data.order
    });
  } catch (error) {
    console.error('Error during checkout API submit:', error.message);
    res.status(500).send('Checkout processing failed');
  }
};
