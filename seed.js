const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Admin = require('./models/Admin');


const products = [
  {
    name: "Smoked Spanish Paprika",
    description: "Oak-smoked pimentón from the Extremadura region of Spain. This vibrant red powder delivers a deep, smoky aroma and a sweet, complex flavor profile. Perfect for dry rubs, paella, roasted potatoes, and stews.",
    price: 9.99,
    category: "spices",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop",
    ingredients: "100% Sweet Smoked Spanish Paprika",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Organic Korintje Cinnamon",
    description: "High-grade sweet cinnamon harvested from the volcanic slopes of Sumatra, Indonesia. Warm, woody, and intensely aromatic, this cinnamon is perfect for baking, oatmeal, morning coffee, or savory slow-cooker curries.",
    price: 8.49,
    category: "spices",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=600&auto=format&fit=crop",
    ingredients: "Organic Ground Korintje Cinnamon (Cinnamomum burmannii)",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Herbes de Provence",
    description: "A traditional French culinary blend of aromatic summer herbs. Fragrant and versatile, it brings the sunny flavor of Southern France to your kitchen. Excellent on roast chicken, grilled vegetables, fish, and tomato-based dishes.",
    price: 8.99,
    category: "herbs",
    sizes: ["1.5 oz Jar", "3 oz Flatpack", "12 oz Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1532135002030-9dfa8eb3971c?q=80&w=600&auto=format&fit=crop",
    ingredients: "Thyme, Basil, Rosemary, Tarragon, Savory, Marjoram, Oregano, Lavender Buds",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Coarse Himalayan Pink Salt",
    description: "Pure, mineral-rich rock salt hand-mined deep within the pristine Himalayan Mountains. Features a subtle, clean salty flavor and a beautiful pink hue from trace iron minerals. Perfect for salt grinders, finishing grilled meats, and roasting veggies.",
    price: 7.99,
    category: "salts",
    sizes: ["4 oz Jar", "8 oz Flatpack", "2 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=600&auto=format&fit=crop",
    ingredients: "100% Natural Himalayan Pink Rock Salt",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Everything Bagel Seasoning",
    description: "The ultimate savory crunch blend. A premium mix of toasted sesame, garlic, onion, and poppy seeds combined with flaky sea salt. Sprinkle over avocado toast, eggs, baked potatoes, salads, or homemade bread.",
    price: 8.99,
    category: "seasonings",
    sizes: ["2.5 oz Jar", "5 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
    ingredients: "Toasted Sesame Seeds, Black Sesame Seeds, Dried Minced Garlic, Dried Minced Onion, Poppy Seeds, Sea Salt Flakes",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Tellicherry Black Peppercorns",
    description: "Premium left-to-ripen Tellicherry peppercorns from Malabar, India. Larger, sweeter, and more complex than standard black pepper, with bright citrus and pine notes. Designed for fresh grinding to elevate any savory dish.",
    price: 11.49,
    category: "spices",
    sizes: ["2.5 oz Jar", "5 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=600&auto=format&fit=crop",
    ingredients: "Whole Tellicherry Black Peppercorns",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Golden Turmeric Powder",
    description: "Super-premium turmeric powder harvested in India, boasting a high curcumin content for maximum flavor and health benefits. Earthy, slightly bitter, and beautifully golden. Essential for golden milk, curries, and roasted root vegetables.",
    price: 9.29,
    category: "spices",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
    ingredients: "Organic Ground Turmeric Root (Curcuma longa)",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Artisan Ground Cumin",
    description: "Freshly roasted and ground cumin seeds from heritage farms. Intensely aromatic, earthy, and warm with a slight citrus undertone. A fundamental spice for Mexican, Middle Eastern, and Indian cuisines.",
    price: 8.99,
    category: "spices",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop",
    ingredients: "100% Ground Cumin Seeds",
    isFeatured: false,
    stockStatus: "low-stock"
  }
];

const blogs = [
  {
    title: "The Essential Guide to Grinding Your Own Spices",
    subtitle: "Unlock maximum aroma, freshness, and flavor by transitioning from pre-ground powders to whole spices.",
    content: `
      <p>If you're still buying pre-ground spices from the grocery store, you are missing out on the true magic of cooking. The moment a spice is ground, its volatile essential oils begin to evaporate, and its flavor immediately starts to degrade. Within months, that jar of ground cumin or coriander on your shelf becomes a dusty shadow of its former self.</p>
      
      <h3>Why Whole Spices Reign Supreme</h3>
      <p>Whole spices hold onto their essential oils indefinitely. By buying whole seeds, pods, and barks, and grinding them fresh right before you cook, you ensure that the oils release directly into your pan. This translates to richer aromas, deeper heat, and nuanced flavor profiles that pre-ground alternatives simply cannot match.</p>
      
      <h3>Step-by-Step: Toasting for Maximum Aroma</h3>
      <p>Toasting your whole spices before grinding wakes up the essential oils and introduces a warm, nutty complexity. Here is how to do it:</p>
      <ol>
        <li>Heat a dry skillet (cast iron works best) over medium-low heat. Do not add oil!</li>
        <li>Add your whole spices (e.g., cumin seeds, coriander seeds, cardamom pods) and keep them moving constantly.</li>
        <li>Toast for 1 to 2 minutes, or just until they release a rich aroma and turn a shade darker.</li>
        <li>Immediately transfer the spices to a plate to cool. If left in the hot pan, they will burn and turn bitter.</li>
      </ol>
      
      <h3>Choosing Your Grinder</h3>
      <p>For grinding, you have two primary choices:</p>
      <ul>
        <li><strong>The Mortar and Pestle:</strong> Ideal for rustic texture. Perfect for crushing peppercorns, fennel seeds, or creating textured pastes.</li>
        <li><strong>Electric Blade Grinder:</strong> A cheap coffee grinder dedicated solely to spices will pulverize cinnamon bark, nutmeg, and tough seeds into a silky fine powder in seconds.</li>
      </ul>
      <p>Upgrade your pantry today by stocking whole spices and investing in a simple grinder. Your cooking will never be the same!</p>
    `,
    author: "Chef Marcus Vance",
    category: "Guides & Tips",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop",
    readTime: 4
  },
  {
    title: "Demystifying Curry: How to Blend Your Own Curry Powder",
    subtitle: "Move past generic yellow tins and learn how to construct customized, aromatic curry blends tailored to your dishes.",
    content: `
      <p>In many Western kitchens, "curry" is thought of as a single spice that comes out of a yellow metal tin. In reality, curry powder is a British invention meant to mimic the complex spice blends (masalas) used throughout India. True curry blending is a highly personal craft, with families and chefs passing down their unique spice ratios for generations.</p>
      
      <h3>The Foundation of a Great Blend</h3>
      <p>Most classic curry powders consist of a few core ingredients that provide body, color, and warmth, balanced by accent spices for heat and aroma. Let's break down the layers:</p>
      
      <h4>1. The Base (Color & Earthiness)</h4>
      <p><strong>Turmeric</strong> is the backbone of any curry powder. It provides that signature golden hue and a subtle, earthy, bitter note. <strong>Coriander</strong> provides a sweet, citrusy body, while <strong>Cumin</strong> brings a warm, savory, and rustic depth.</p>
      
      <h4>2. The Warmth (Sweet Spices)</h4>
      <p>Spices like <strong>Cardamom</strong>, <strong>Cinnamon</strong>, <strong>Cloves</strong>, and <strong>Nutmeg</strong> add sweet, floral, and highly complex top notes. Use these sparingly, as their flavors are potent and can easily overwhelm the blend.</p>
      
      <h4>3. The Heat</h4>
      <p>Adjust the fire of your curry with <strong>Cayenne Pepper</strong> or dry red chilis. For a milder warmth, utilize fresh-ground <strong>Black Pepper</strong> and <strong>Ginger Powder</strong>.</p>
      
      <h3>A Simple Recipe to Get Started</h3>
      <p>Mix these ground ingredients together for a versatile house curry powder:</p>
      <ul>
        <li>2 tbsp Ground Coriander</li>
        <li>2 tbsp Ground Turmeric</li>
        <li>1 tbsp Ground Cumin</li>
        <li>1 tsp Ground Ginger</li>
        <li>1 tsp Ground Black Pepper</li>
        <li>1/2 tsp Cayenne Pepper (adjust to taste)</li>
        <li>1/2 tsp Ground Cardamom</li>
        <li>1/2 tsp Ground Cinnamon</li>
      </ul>
      <p>Store your custom blend in an airtight glass jar away from direct sunlight, and enjoy the difference of a fresh, homemade blend in your next stew, roast, or rice dish.</p>
    `,
    author: "Elena Rostova",
    category: "Recipes & Blending",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop",
    readTime: 6
  },
  {
    title: "How to Store Spices for Maximum Flavor and Shelf Life",
    subtitle: "Are your spices losing their punch? Learn the four enemies of dry spices and how to keep your pantry fresh.",
    content: `
      <p>Spices don't necessarily "spoil" or rot in a way that makes you sick, but they certainly fade away. A jar of dried basil from 2021 might look green, but it likely tastes like dried leaves rather than a fresh herb. To get the most value out of your spice collection, you must protect them from degradation.</p>
      
      <h3>The Four Enemies of Spices</h3>
      <p>To keep your spices fresh, you must defend them against these four factors:</p>
      
      <h4>1. Heat</h4>
      <p>Storing your spice rack directly above or next to your stove is highly convenient, but it is the fastest way to ruin them. Constant heat breaks down the essential oils that give spices their taste and smell. Store them in a cool pantry or cabinet instead.</p>
      
      <h4>2. Light</h4>
      <p>Direct sunlight behaves like heat, bleaching the colors out of spices and breaking down their organic chemical structures. Glass jars look gorgeous on open shelving, but unless they are stored in a dark drawer or cabinet, they will rapidly lose their potency.</p>
      
      <h4>3. Moisture</h4>
      <p>Never shake a spice jar directly over a steaming pot of soup or sauce! The rising steam enters the jar, causing the spices to cake, clump, and potentially grow mold. Instead, shake the spices into your hand or a spoon away from the steam, then transfer them to the pot.</p>
      
      <h4>4. Air</h4>
      <p>Keep your spice jars tightly sealed. Oxygen exposure oxidizes the oils in the spices, reducing their flavor output. If buying in bulk, transfer smaller amounts to daily jars and store the main supply tightly sealed in a dark cupboard.</p>
      
      <h3>Shelf Life Guidelines</h3>
      <p>As a rule of thumb, check your spices at these intervals:</p>
      <ul>
        <li><strong>Whole Spices:</strong> 3 to 4 years</li>
        <li><strong>Ground Spices:</strong> 1 to 2 years</li>
        <li><strong>Leafy Herbs:</strong> 1 year</li>
      </ul>
      <p>Give your spices a quick sniff before using. If they don't release a strong aroma when rubbed between your fingers, it's time to replace them!</p>
    `,
    author: "Chef Marcus Vance",
    category: "Guides & Tips",
    imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=600&auto=format&fit=crop",
    readTime: 3
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan_spices';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await Admin.deleteMany({});

    // Seed Admin
    console.log('Seeding admin account...');
    const admin = new Admin({
      username: 'admin',
      password: 'spicehaven123'
    });
    await admin.save();
    console.log('Admin account created (Username: admin, Password: spicehaven123)');

    // Seed Products
    console.log('Seeding products...');
    for (const prodData of products) {
      const prod = new Product(prodData);
      await prod.save();
    }
    console.log(`${products.length} products successfully seeded.`);

    // Seed Blogs
    console.log('Seeding blog articles...');
    for (const blogData of blogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log(`${blogs.length} blog articles successfully seeded.`);

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

seed();
