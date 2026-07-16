const Product = require('../models/Product');
const Blog = require('../models/Blog');

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
