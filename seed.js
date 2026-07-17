const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Admin = require('./models/Admin');
const Recipe = require('./models/Recipe');

const products = [
  {
    name: "Whole Cardamom Pods",
    description: "Premium green cardamom pods from Kerala, India. Rich in sweet, eucalyptus-like aromas and warm herbal flavor. Essential for traditional biryani, curries, and spiced teas.",
    price: 12.99,
    category: "Spices & Whole Seeds",
    subCategory: "Whole Spices",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251817/Whole_Spices_uzxf2w.jpg",
    ingredients: "100% Green Cardamom Pods",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Ground Turmeric Powder",
    description: "Super-premium golden turmeric root powder containing high natural curcumin levels. Earthy, warm, and slightly bitter. Perfect for golden milk, curries, and healthy rice dishes.",
    price: 9.49,
    category: "Spices & Whole Seeds",
    subCategory: "Ground Spices",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251820/Ground_Spices_reqhgq.jpg",
    ingredients: "100% Ground Turmeric Root (Curcuma longa)",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Garam Masala Blend",
    description: "Our signature blend of warm Indian spices. Roasting whole peppercorns, cloves, cinnamon, cardamom, and nutmeg creates a deeply complex fragrance. Add at the end of cooking to preserve aromatic notes.",
    price: 10.99,
    category: "Spices & Whole Seeds",
    subCategory: "Indian Spices",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251816/Indian_Spices_llevmx.jpg",
    ingredients: "Black Peppercorns, Cardamom, Cinnamon, Cloves, Nutmeg, Coriander, Cumin",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Ground Allspice",
    description: "Warm, woodsy, and sweet berry powder harvested from Jamaican pimento trees. Recalls a natural fusion of cinnamon, nutmeg, and cloves. Perfect for holiday cookies, jerk chicken rubs, and stews.",
    price: 8.99,
    category: "Spices & Whole Seeds",
    subCategory: "Baking Spices",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251814/baking_spices_n1g8nf.jpg",
    ingredients: "100% Ground Pimento Berries",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Coriander Seeds",
    description: "Whole dried coriander seeds featuring bright, citrusy, and sweet aromatic notes. Toast lightly in a dry pan to unlock warm, woodsy oils before grinding for rubs or curries.",
    price: 7.99,
    category: "Spices & Whole Seeds",
    subCategory: "Seeds & Berries",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251814/seeds_berries_mgysdw.jpg",
    ingredients: "100% Dried Coriander Seeds",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Exotic Kashmir Saffron",
    description: "Ultra-premium Grade A saffron threads harvested by hand in Kashmir. Delivers intense crimson color, floral sweetness, and metallic honey highlights. A tiny pinch elevates rice, bouillabaisse, and paella.",
    price: 24.99,
    category: "Spices & Whole Seeds",
    subCategory: "Saffron",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["1 gram Gram-Tine", "2 grams Tin"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251813/saffron_sum8eq.webp",
    ingredients: "100% Pure Kashmir Saffron Threads",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Whole Leaf Oregano",
    description: "Mediterranean wild whole leaf oregano dried slowly on the branch. Pungent, slightly bitter, and herbaceous. Rub flakes between your fingers to release the oils right over pizzas and pasta sauces.",
    price: 7.49,
    category: "Herbs & Seasonings",
    subCategory: "Dried Herbs",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["1 oz Jar", "2 oz Flatpack", "8 oz Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251815/Dried_Herbs_dxud4y.jpg",
    ingredients: "100% Dried Mediterranean Oregano Leaves",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Ground Sage Powder",
    description: "Finely ground culinary sage leaves featuring warm, pine-like, and peppery flavor accents. A must-have spice for stuffing, rich brown butter sauces, pork tenderloins, and poultry glazes.",
    price: 8.29,
    category: "Herbs & Seasonings",
    subCategory: "Ground Herbs",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["1.5 oz Jar", "3 oz Flatpack", "10 oz Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251812/Ground_Herbs_ejj8ht.jpg",
    ingredients: "100% Ground Sage Leaves",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Italian Herb Seasoning",
    description: "A traditional Tuscan spice blend combining sweet basil, wild oregano, rosemary, and thyme. Brings the authentic, warm, and herbaceous fragrance of Italy to marinaras and garlic breads.",
    price: 8.99,
    category: "Herbs & Seasonings",
    subCategory: "Spice & Herb Blends",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["1.5 oz Jar", "3 oz Flatpack", "12 oz Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251813/Spice_Herb_Blends_hv8jt9.jpg",
    ingredients: "Basil, Oregano, Rosemary, Thyme, Marjoram, Sage",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Madras Curry Powder",
    description: "A classic southern Indian curry powder with mild, earthy heat. Composed of ground coriander, turmeric, cumin, ginger, and fenugreek. Perfect for chicken curry, roasted chickpeas, and winter stews.",
    price: 9.49,
    category: "Herbs & Seasonings",
    subCategory: "Curry Powders",
    mainCategoryGroup: "Spices & Herbs",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251812/Curry_Powders_cqrtk1.jpg",
    ingredients: "Coriander, Turmeric, Cumin, Mustard, Fenugreek, Ginger, Cayenne",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Coarse Sea Salt Crystals",
    description: "Harvested from clean coastal waters, these thick, crunchy crystals deliver a pure, clean mineral saltiness. Ideal for salt mills, boiling pasta water, and coarse seasoning rubs.",
    price: 6.99,
    category: "Salts & Peppercorns",
    subCategory: "Sea Salt & Grey Salt",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["4 oz Jar", "8 oz Flatpack", "2 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251810/Sea_Salt_Grey_Salt_wn9eb6.jpg",
    ingredients: "100% Pure Sea Salt",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Smoked Applewood Sea Salt",
    description: "Flaky sea salt cold-smoked over sweet Applewood embers. Imparts a sweet, clean, and mildly smoky flavor profile. Use as a premium finishing salt on grilled salmon, pork, or steak.",
    price: 10.49,
    category: "Salts & Peppercorns",
    subCategory: "Artisanal & Finishing Salts",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["3 oz Jar", "6 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251808/Artisanal_Finishing_Salts_f9lou1.jpg",
    ingredients: "Applewood Smoked Sea Salt",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Roasted Garlic Flake Salt",
    description: "Savory flakes of premium sea salt blended with crispy bits of slow-roasted garlic. Elevates pasta dishes, roasted potatoes, garlic bread, and popcorn instantly.",
    price: 8.99,
    category: "Salts & Peppercorns",
    subCategory: "Flavored Salts",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["2.5 oz Jar", "5 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251809/Flavored_Salts_oglnax.jpg",
    ingredients: "Sea Salt, Dehydrated Roasted Garlic",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Pink Curing Salt",
    description: "Professional grade curing salt containing sodium nitrite. Crucial for long curing processes like sausage making, bacon curing, and charcuterie preservation. Keeps meat pink and fresh.",
    price: 7.99,
    category: "Salts & Peppercorns",
    subCategory: "Curing Salt",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["4 oz Jar", "8 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251808/Curing_Salt_a2pbfr.jpg",
    ingredients: "Salt, Sodium Nitrite (6.25%), Red #3 coloring agent",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Tellicherry Peppercorns",
    description: "Premium large black peppercorns from Malabar, India. Kept on the vine longer to develop complex, sweet, and piney citrus aromas. Best freshly crushed in a pepper mill.",
    price: 11.49,
    category: "Salts & Peppercorns",
    subCategory: "Peppercorns",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["2.5 oz Jar", "5 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251807/Peppercorns_gpozex.jpg",
    ingredients: "Whole Tellicherry Black Peppercorns",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Whole Ancho Chilies",
    description: "Sweet, dried poblano chili peppers featuring deep notes of raisin, plum, and mild cocoa heat. Rehydrate in warm water to blend into authentic Mexican mole sauces and chili pastes.",
    price: 9.99,
    category: "Dried Chilis & Paprika",
    subCategory: "Whole Chili Peppers",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["3 oz Flatpack", "8 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251815/Whole_Chili_Peppers_dfceg0.jpg",
    ingredients: "Whole Dried Ancho Chili Peppers",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Crushed Cayenne Pepper",
    description: "Vibrant red crushed cayenne pepper seeds and flakes. Adds a sharp, clean, and intense spice punch. Sprinkle over pizzas, stir-fries, and marinades for a natural heat kick.",
    price: 7.99,
    category: "Dried Chilis & Paprika",
    subCategory: "Chili Powder & Flakes",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251807/Chili_Powder_Flakes_sywywj.jpg",
    ingredients: "100% Crushed Cayenne Pepper Flakes",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Smoked Spanish Paprika",
    description: "Oak-smoked sweet pimentón from the Extremadura valley of Spain. Adds a bright red color, sweet woodsy aroma, and complex depth. Perfect for paella, dry rubs, and roasted potatoes.",
    price: 9.99,
    category: "Dried Chilis & Paprika",
    subCategory: "Paprika",
    mainCategoryGroup: "Salts & Peppers",
    sizes: ["2 oz Jar", "4 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251806/Paprika_fx9q0j.jpg",
    ingredients: "100% Sweet Smoked Spanish Paprika",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Ceylon Cinnamon Sticks",
    description: "Genuine 'true' cinnamon scrolls from Sri Lanka. Delicate, sweet, and complex flavors with citrusy notes. Break a stick to simmer in mulled ciders, rice pudding, or spiced stews.",
    price: 11.99,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Cinnamon",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["1.5 oz Jar", "3 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251805/Cinnamon_g164zd.jpg",
    ingredients: "Whole Ceylon Cinnamon Sticks",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Gourmet Vanilla Bean Paste",
    description: "Rich Madagascar Bourbon vanilla paste loaded with real vanilla bean seeds. Thick, sweet, and aromatic. A premium substitute for vanilla extract to give custard and cookies black bean specks.",
    price: 18.99,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Vanilla Vault",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["2 oz Jar", "4 oz Jar"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251805/Vanilla_Vault_efvvbq.jpg",
    ingredients: "Vanilla Extract, Vanilla Seeds, Sugar, Natural Gum Binder",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Nacional Cacao Powder",
    description: "Premium Ecuadorian Nacional dark cacao powder. High fat-content and minimally alkalized to preserve natural berry and floral notes. Perfect for cocoa, brownies, and baking.",
    price: 12.49,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Chocolate & Cacao",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["8 oz Bag", "16 oz Bag"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251805/Chocolate_Cacao_xjbvwi.jpg",
    ingredients: "100% Premium Ecuadorian Nacional Cacao Powder",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Organic Coconut Sugar",
    description: "Unrefined sugar granulated from the sweet nectar of coconut palm blossoms. Imparts a mild caramel flavor, serving as a low-glycemic, natural sugar substitute for baking.",
    price: 8.99,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Sweeteners & Sugars",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["12 oz Flatpack", "2 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251801/Sweeteners_Sugars_uomdfm.jpg",
    ingredients: "100% Organic Coconut Palm Sugar",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Sweet Mango Powder (Amchur)",
    description: "Tangy mango powder ground from green, unripe mango slices. Gives a clean fruit sourness and tart element without adding wet liquid. Essential for Indian curries, pakoras, and chat masala.",
    price: 9.49,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Fruit Powders & Pieces",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["2 oz Jar", "4 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251801/Fruit_Powders_Pieces_xbqv8u.jpg",
    ingredients: "Ground Green Unripe Mangoes",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Toasted Coconut Shreds",
    description: "Finely shredded organic coconut meat gently toasted to develop a rich, nutty flavor and crispy texture. A premium topping for granola, oatmeal, desserts, and curries.",
    price: 7.99,
    category: "Baking, Vanilla & Sweeteners",
    subCategory: "Coconut Shreds & Flakes",
    mainCategoryGroup: "Baking & Sweeteners",
    sizes: ["8 oz Bag", "16 oz Bag"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251800/Coconut_Shreds_Flakes_eujczw.jpg",
    ingredients: "100% Toasted Unsugared Coconut Shreds",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Granulated Garlic Staples",
    description: "Slow-dried fresh garlic cloves granulated into sweet, pungent, and savory powder. Blends seamlessly into dry spice rubs, salad dressings, and marinades.",
    price: 7.99,
    category: "Dried Vegetables & Mushrooms",
    subCategory: "Pantry Staples",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["2.5 oz Jar", "5 oz Flatpack", "1 lb Bulk"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251801/Pantry_Staples_byinq1.jpg",
    ingredients: "100% Granulated Garlic",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Dehydrated Tomato Powder",
    description: "Granulated powder made from ripe red tomatoes. Adds a concentrated umami punch, rich sweetness, and vibrant red color. Ideal for soups, instant sauces, and marinades.",
    price: 9.99,
    category: "Dried Vegetables & Mushrooms",
    subCategory: "Diced Vegetables & Powders",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["3 oz Jar", "6 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251799/Diced_Vegetables_Powders_lmm3p6.jpg",
    ingredients: "100% Dehydrated Tomatoes",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Dried Porcini Mushrooms",
    description: "Premium dried wild porcini mushroom slices from European forests. Rich in earthiness and woodsy umami notes. Rehydrate in warm water for risottos, cream sauces, and gravies.",
    price: 15.99,
    category: "Dried Vegetables & Mushrooms",
    subCategory: "Mushrooms",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["1 oz Jar", "2 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251799/Mushrooms_li1pss.jpg",
    ingredients: "Dried Porcini Mushrooms (Boletus edulis)",
    isFeatured: true,
    stockStatus: "in-stock"
  },
  {
    name: "Hickory Smoke Powder",
    description: "Concentrated natural hickory wood smoke condensed in a dry powder base. Delivers a clean, sweet, and deep barbecue pit aroma. Elevates dry seasoning rubs and sauces.",
    price: 8.99,
    category: "Specialty Powders & Flavors",
    subCategory: "Smoke & Sauce Powders",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["2.5 oz Jar", "5 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251799/Smoke_Sauce_Powders_m2pg6p.jpg",
    ingredients: "Barbecue Powder, Hickory Smoke Condensate",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Apple Cider Vinegar Powder",
    description: "Tangy dehydrated apple cider vinegar solids. Delivers clean apple sweetness and sharp vinegar acidity. Sprinkle over chips, fried chicken, or incorporate into dry spice rubs.",
    price: 8.49,
    category: "Specialty Powders & Flavors",
    subCategory: "Vinegar Powders",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["2.5 oz Jar", "5 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251798/Vinegar_Powders_qyp3xm.jpg",
    ingredients: "Apple Cider Vinegar Solids, Maltodextrin binder",
    isFeatured: false,
    stockStatus: "in-stock"
  },
  {
    name: "Spiced Masala Chai Tea",
    description: "Premium black loose leaf tea blended with sweet cardamom, ginger, cinnamon, and whole cloves. Simmer in warm milk with honey for an authentic, cozy, and spiced Indian chai.",
    price: 11.99,
    category: "Beverages",
    subCategory: "Loose Leaf Teas",
    mainCategoryGroup: "Pantry & Teas",
    sizes: ["3 oz Tin", "6 oz Flatpack"],
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784251799/Loose_Leaf_Teas_zgyoot.jpg",
    ingredients: "Assam Black Tea, Ginger, Cardamom, Cinnamon, Cloves, Black Pepper",
    isFeatured: true,
    stockStatus: "in-stock"
  }
];

const blogs = [
  {
    title: "DIY Fall Stovetop Potpourri",
    subtitle: "Make your home smell like cozy autumn with natural spices and fresh fruits.",
    content: `
      <p>There is nothing quite like opening your front door and being greeted by the warm, grounding aromas of autumn. While store-bought candles and room sprays are convenient, they often carry heavy, synthetic scents that can feel overwhelming. A stovetop potpourri is the ultimate natural alternative, using real spices, citrus, and herbs to simmer a custom, homey scent profile directly in your kitchen.</p>
      <h3>The Perfect Autumn Simmer Ingredients</h3>
      <p>Creating your own stovetop blend is simple and highly forgiving. Here is our favorite base recipe to fill your home with cozy vibes:</p>
      <ul>
        <li>1 fresh orange, sliced thick</li>
        <li>1 cup fresh cranberries (adds a beautiful pop of color and tart aroma)</li>
        <li>3 whole cinnamon sticks</li>
        <li>1 tbsp whole cloves</li>
        <li>2 star anise pods</li>
        <li>1 fresh sprig of rosemary (provides a subtle piney backnote)</li>
      </ul>
      <h3>How to Simmer</h3>
      <p>Place all of your ingredients into a medium saucepan or small Dutch oven. Fill the pot with water until the ingredients are mostly submerged (about 3 to 4 cups). Place the pot on your stovetop over medium heat until it reaches a low boil, then immediately turn the heat down to low. Let it simmer gently, uncovered. Your kitchen will fill with a rich, cinnamon-spiced scent within 15 minutes. Just be sure to check the water level every hour and top it up so the ingredients don't dry out and burn!</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238656/DIY_Fall_Stovetop_Potpourri_ashvf3.jpg",
    readTime: 4
  },
  {
    title: "Discover the Bold Flavor of Sichuan Pepper",
    subtitle: "Explore the electric, tingling sensation and citrus aromas of this historic spice.",
    content: `
      <p>If you've ever enjoyed a authentic Kung Pao chicken or a bubbling Sichuan hot pot, you know the singular sensation of Sichuan peppercorns. It is not "hot" in the traditional way cayenne or black pepper is. Instead, it offers a refreshing, citrusy aroma followed by a numbing, tingling effect on the tongue, a sensation the Chinese call "málà".</p>
      <h3>What is a Sichuan Peppercorn?</h3>
      <p>Sichuan peppercorns are not actually peppercorns at all. They are the small reddish-pink seed husks of a deciduous shrub in the citrus family (Zanthoxylum). This explains why they carry such a bright, lemon-like scent before the tingling kicks in. The tingling sensation is caused by a chemical compound called alpha-sanshool, which interacts with tactile receptors on your tongue, mimicking a rapid vibration.</p>
      <h3>How to Use it at Home</h3>
      <p>For the best flavor, buy whole Sichuan peppercorns, pick out any dark inner seeds (which are gritty and tasteless), and toast the husks gently in a dry pan until they release a citrusy aroma. Grind them into a fine powder and use them in dry rubs, noodle sauces, or sprinkle a pinch over hot stir-fry dishes right before serving to lock in the aroma.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238656/Discover_the_Bold_Flavor_of_Sichuan_Pepper_ml9nzn.jpg",
    readTime: 5
  },
  {
    title: "Elevate your Easter Ham: Delicious glaze Recipes",
    subtitle: "Ditch the mystery packet and make your own hand-crafted glaze with pantry spices.",
    content: `
      <p>A beautifully glazed ham is the crowning centerpiece of the Easter table. Yet, all too often, home cooks rely on the foil seasoning packet that comes in the ham packaging, which is usually packed with corn syrup, artificial colorings, and stale powdered spices. Making your own glaze is incredibly simple and allows you to adjust the sweetness and spice balances to your liking.</p>
      <h3>The Sweet-Spicy Glaze Formula</h3>
      <p>The secret to an unforgettable ham glaze is balance. You need a sweet base (to caramelize on the skin), an acid (to cut through the rich pork fat), and warm spices (to provide depth). Here is a fantastic recipe using warm, whole pantry spices:</p>
      <ul>
        <li>1 cup brown sugar or honey</li>
        <li>1/2 cup fresh orange juice (acidic balance)</li>
        <li>2 tbsp Dijon mustard</li>
        <li>1/2 tsp ground cloves</li>
        <li>1/4 tsp ground cinnamon</li>
        <li>1/4 tsp freshly grated nutmeg</li>
      </ul>
      <p>Whisk the ingredients together in a small saucepan and simmer over low heat until the sugar dissolves. Brush the glaze generously over your ham during the last 30 to 45 minutes of baking, baste every 15 minutes, and watch it turn into a beautiful, sticky, golden-brown crust.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238655/Elevate_your_Easter_Ham_Delicious_glaze_Recipes_x9rcmf.jpg",
    readTime: 5
  },
  {
    title: "Chili Cookoff: Top Chili Recipes to try",
    subtitle: "Four secrets to crafting award-winning chilis with robust, layered spice profiles.",
    content: `
      <p>A true chili cookoff is won or lost in the spice drawer. While ground beef, beans (or no beans, if you're a Texan!), and tomatoes build the body of the stew, it's the selection and preparation of dried chilis and spices that give chili its soul. If you want to take home the trophy this year, it's time to elevate your spice game.</p>
      <h3>The Spice Layering Strategy</h3>
      <p>Don't just dump in commercial "chili powder" from a store-bought jar. Build layers of flavor instead:
      <ul>
        <li><strong>The Earthy Base:</strong> Roasting and grinding whole cumin seeds fresh is a game-changer. Cumin provides the foundational warmth that defines chili.</li>
        <li><strong>The Dried Chilis:</strong> Blend a mixture of mild, sweet chilis (like Ancho or Pasilla) with smoky chilis (like Chipotle) to create a thick, flavorful paste rather than using dry powder alone.</li>
        <li><strong>The Secret Catalyst:</strong> Add a pinch of unsweetened cocoa powder and ground cinnamon. They won't make your chili taste like chocolate or dessert; instead, they add a rich, dark complexity that leaves judges wondering what your secret ingredient is.</li>
      </ul>
      <p>Simmer your spices early in the cooking process with your onions and garlic to release their fat-soluble flavor compounds, ensuring every spoonful is packed with robust heat.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238659/Chili_Cookoff_Top_Chili_Recipes_to_try_dxwww9.jpg",
    readTime: 6
  },
  {
    title: "The Spicy Savior: Sriracha Powder as Your Culinary Wingman",
    subtitle: "Discover how sriracha powder brings concentrated, dry heat and tang to your favorite dishes.",
    content: `
      <p>Almost everyone has a green-capped bottle of Sriracha sauce in their refrigerator. But while the wet sauce is perfect for squeezing over noodles or fried eggs, it can sometimes make food soggy or thin out dry rub mixtures. Enter Sriracha Powder, the dry, concentrated sibling that packs the exact same garlic-chili kick with none of the moisture.</p>
      <h3>Where to Use Sriracha Powder</h3>
      <p>Sriracha powder combines spicy cayenne pepper, garlic powder, salt, and vinegar solids to replicate that classic tangy heat. It's the ultimate wingman for dry applications:
      <ul>
        <li><strong>Spicy Popcorn:</strong> Toss freshly popped corn in melted butter and a generous shake of sriracha powder for a cinema-worthy snack.</li>
        <li><strong>Crispy Chicken Wings:</strong> Use it as a dry rub alongside cornstarch before baking or air-frying your wings for a super-crispy skin that carries built-in heat.</li>
        <li><strong>Fries & Roasted Veggies:</strong> Toss potato wedges or Brussels sprouts in olive oil and sriracha powder before roasting to get crispy caramelized edges with a spicy kick.</li>
      </ul>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238655/The_Spicy_Savior_Sriracha_Powder_as_Your_Culinary_Wingman_vsw2ih.jpg",
    readTime: 4
  },
  {
    title: "The Perfect Blend: Mastering Meat and Spice Pairing",
    subtitle: "A comprehensive guide to selecting seasonings that balance and highlight different cuts of meat.",
    content: `
      <p>Cooking meat is an art of balance. Different meats carry distinct flavor profiles, fat structures, and textures, which means a rub that tastes spectacular on a rack of ribs might completely overpower a delicate pork tenderloin or a piece of chicken breast. To elevate your kitchen craft, you must master the chemistry of meat and spice pairings.</p>
      <h3>Beef: Bold and Robust</h3>
      <p>Beef has a heavy fat profile and rich, iron-forward flavors. It demands assertive spices that can cut through the fat. Stick to coarse Himalayan salt, cracked Tellicherry peppercorns, garlic flakes, mustard seeds, and earthy rosemary. Smoked paprika also pairs beautifully to mimic charcoal aromas.</p>
      <h3>Poultry: Delicate and Herb-Forward</h3>
      <p>Chicken has a mild flavor that easily absorbs herbs. Sage, thyme, rosemary, and marjoram are the classic French botanical choices. For a brighter, modern profile, combine ground ginger, coriander, and lemon peel to lift the meat without masking its natural juices.</p>
      <h3>Pork: Sweet and Spicy</h3>
      <p>Pork matches exceptionally well with sweet and warm spice undertones. Brown sugar, fennel seeds, coriander, cumin, and warm cinnamon make for stunning rubs. Fennel, in particular, cuts through pork loin fat and brings out a clean, sweet anise profile.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238657/The_Perfect_Blend_Mastering_Meat_and_Spice_Pairing_mggnmo.jpg",
    readTime: 6
  },
  {
    title: "Unique Pumpkin Spice Recipes",
    subtitle: "Explore creative ways to use pumpkin spice beyond the standard latte or pie.",
    content: `
      <p>When autumn rolls around, pumpkin spice is everywhere. But the classic combination of cinnamon, nutmeg, ginger, and cloves is far too versatile to be locked in a coffee cup or a sweet dessert pie. The sweet-warm profile of pumpkin spice can elevate a surprising variety of savory and unique dishes.</p>
      <h3>Savory Pumpkin Spice Roasted Squash</h3>
      <p>Try tossing cubed butternut squash or sweet potatoes in olive oil, a pinch of pumpkin spice, coarse sea salt, and a dash of cayenne pepper. Roast at 400°F until caramelized. The heat from the cayenne and salt balances the warm cinnamon and cloves, highlighting the natural sweetness of the squash without tasting sugary.</p>
      <h3>Warm Breakfast Granola</h3>
      <p>Make your own breakfast mix by tossing rolled oats, pecans, and pumpkin seeds in maple syrup, coconut oil, and a tablespoon of pumpkin spice. Bake on a sheet pan at 325°F for 25 minutes, tossing occasionally, for a crisp, fall-scented morning bowl.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238654/Unique_Pumpkin_Spice_Recipes_lz0txw.jpg",
    readTime: 4
  },
  {
    title: "A brief History of Spooky Spices and Haunted Herbs",
    subtitle: "Unearth the folklore, myths, and historic uses of spices once associated with magic and protection.",
    content: `
      <p>For thousands of years, spices and herbs were valued far beyond their culinary uses. Long before they were stored in kitchen spice racks, herbs and bark were used in medicine, religious rituals, and folklore protection. During the Middle Ages, many common kitchen herbs carried heavy, magical reputations, believed to ward off evil spirits or draw in good fortune.</p>
      <h3>Haunted Rosemary & Midnight Cloves</h3>
      <p><strong>Rosemary</strong> was historically placed under pillows to ward off bad dreams and keep away evil spirits. In old England, it was believed that if rosemary grew vigorously in a home's garden, it meant the mistress of the house was the true leader! <strong>Whole Cloves</strong>, with their intense aroma, were burned as incense to protect families from plagues and malevolent energy, while <strong>Star Anise</strong> was hung over bed posts to ward off nightmares and invoke clean sleep.</p>
      <p>Understanding the history of these botanicals brings a sense of wonder back to the modern kitchen, showing that our spices have always been powerful elements of human tradition.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238661/A_brief_History_of_Spooky_Spices_and_Haunted_Herbs_lziuph.jpg",
    readTime: 5
  },
  {
    title: "Top Grilling Recipes From Allrecipes",
    subtitle: "Chef-tested grilling methods and rubs to maximize smoky flavors on your backyard barbecue.",
    content: `
      <p>Grilling over live coals is one of our favorite ways to cook. When fat drips onto the hot charcoal, it vaporizes, creating a rich smoke that flavors the meat. To make the most of your backyard grill, you need a high-temperature seasoning strategy that seals in flavor without burning on the grates.</p>
      <h3>The Golden Rule of Dry Rubs</h3>
      <p>Sugar burns easily at temperatures above 350°F. If you are grilling thick steaks or chicken over direct flame, avoid heavy sugar rubs early in the process. Instead, use a savory blend of coarse Himalayan salt, cracked black pepper, granulated garlic, and rosemary. Save sugar-based glazes or barbecue sauces for the last 10 minutes of cooking to get that perfect caramelized finish without any bitter char.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238653/Top_Grilling_Recipes_From_Allrecipes_esesjn.jpg",
    readTime: 5
  },
  {
    title: "Ingredient Spotlight: Cajun Blackening Seasoning",
    subtitle: "Master the rustic Louisiana technique of pan-searing meat in a bold, dark crust of spices.",
    content: `
      <p>Cajun blackening is a technique made famous in New Orleans during the 1980s. It involves dipping meat (usually fish or chicken) in melted butter, coating it in a thick layer of spices, and searing it in a red-hot cast-iron skillet. The result is a signature dark, flavorful crust that locks in the meat's natural juices.</p>
      <h3>Creating Your Own Cajun Blend</h3>
      <p>A true blackening rub combines a balance of heat, salt, and herbs. Here is the perfect house blend:</p>
      <ul>
        <li>2 tbsp sweet paprika (gives the red color base)</li>
        <li>1 tbsp garlic powder & onion powder</li>
        <li>1 tbsp dried thyme & dried oregano</li>
        <li>1 tsp cayenne pepper (for a kick of heat)</li>
        <li>1 tsp ground black pepper & sea salt</li>
      </ul>
      <p>Ensure your cast-iron pan is extremely hot before adding your seasoned meat. Cook in a well-ventilated kitchen, and enjoy the rich, smoky, herb-packed flavors of the bayou at home.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238652/Ingrdient_Spotlight_Cajun_Blackening_Seasoning_wmfyj1.jpg",
    readTime: 4
  },
  {
    title: "Pickling Recipes",
    subtitle: "A quick, step-by-step guide to making tangy, crisp refrigerator pickles in under an hour.",
    content: `
      <p>Pickling is one of the oldest methods of food preservation. While canning jars can take hours of hot-water bath sterilization, refrigerator pickling is a quick alternative that yields crisp, tangy pickles with minimal effort. It is the perfect showcase for fresh garden vegetables and whole spices.</p>
      <h3>The Quick Pickling Liquid Formula</h3>
      <p>The base ratio for quick pickles is simple: equal parts vinegar and water. Heat 1 cup of white vinegar, 1 cup of water, 1 tbsp of kosher salt, and 1 tbsp of sugar until dissolved. Pour this hot brine directly over sliced cucumbers, red onions, or carrots packed tightly in glass jars. Add a clove of garlic, a pinch of whole peppercorns, and fresh dill, then let it cool before sealing. Store in the fridge for up to a month!</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238654/Pickling_Recipes_p72wb0.jpg",
    readTime: 4
  },
  {
    title: "Summer Grilling Recipes",
    subtitle: "Light, vibrant seasoning strategies for grilled summer fruits and fresh vegetables.",
    content: `
      <p>Summer grilling is usually about steaks and burgers, but the grill grate is also a magical place for fresh summer produce. Grilling peaches, pineapple, zucchini, and bell peppers caramelizes their natural sugars, adding a beautiful depth of flavor that pairs wonderfully with fresh herbs.</p>
      <h3>Grilled Peaches with Herb Honey</h3>
      <p>Slice fresh peaches in half, brush the cut side with a tiny amount of neutral oil, and place face-down on a medium-hot grill for 4 to 5 minutes until grill marks appear. Drizzle with warm honey infused with fresh rosemary buds and lavender for a simple, stunning summer dessert.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238652/Summer_Grilling_Recipes_nmxt0d.jpg",
    readTime: 4
  },
  {
    title: "Spicy Rub Recipes",
    subtitle: "Constructing custom spice rubs that seal in flavor and heat without burning.",
    content: `
      <p>A great spice rub behaves like an outer shell for roasted or grilled meats, sealing in juices and fat while developing a delicious, caramelized bark. The secret to a successful rub is selecting coarse-grain ingredients so the spices release their flavors slowly over heat.</p>
      <h3>The Coarse Savory Rub Recipe</h3>
      <p>Mix 2 parts coarse sea salt, 2 parts cracked black peppercorns, 1 part granulated garlic, 1 part dried minced onion, and a dash of cayenne pepper for heat. Rub generously into brisket, pork chops, or thick steaks, and let it rest for 30 minutes at room temperature before cooking to allow the salt to penetrate the meat.</p>
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238656/Spicy_Rub_Recipes_dzqdj7.jpg",
    readTime: 4
  },
  {
    title: "Delicious Lavender Recipes",
    subtitle: "Learn how to use culinary lavender to add floral elegance to baking and beverages.",
    content: `
      <p>Lavender is famous in aromatherapy, but it is also a highly prized culinary herb in French cooking. Because it contains strong, floral essential oils, it must be used with care, a tiny pinch adds a beautiful, sophisticated aroma, but too much can make your dish taste like soap.</p>
      <h3>Baking with Lavender</h3>
      <p>Try making Lavender Shortbread Cookies by grinding 1 tsp of dried culinary lavender buds with 1/2 cup of sugar in a mortar and pestle until fragrant. Use this lavender sugar in your favorite butter shortbread recipe. The subtle floral notes pair beautifully with rich, buttery crumbs.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238649/Deliciious_Lavender_Recipes_ocr9au.jpg",
    readTime: 5
  },
  {
    title: "The Best Deviled Egg Recipes",
    subtitle: "Elevate your party appetizers with fresh herbs, smoked paprika, and spice-infused fillings.",
    content: `
      <p>Deviled eggs are a classic picnic and party favorite. But while mayonnaise and mustard build a creamy base, it's the seasoning that turns a simple egg into a mouthwatering bite. By swapping standard table pepper for premium fresh spices, you can take this traditional dish to a new level.</p>
      <h3>The Smoked Paprika & Chive Finish</h3>
      <p>Mash your hard-boiled egg yolks with mayonnaise, Dijon mustard, a splash of pickle juice, and a tiny pinch of garlic powder. Pipe the smooth mixture back into the egg white halves. Finish with a generous dusting of sweet Smoked Spanish Paprika and a sprinkle of fresh, finely minced chives for a pop of color and smoky contrast.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238649/The_best_delivered_Egg_Recipes_pwnm4l.jpg",
    readTime: 4
  },
  {
    title: "How and Why to Grind Your Own Spices",
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
    `,
    author: "Chef Marcus Vance",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238650/How_and_Why_to_grind_your_own_spices_eyofti.jpg",
    readTime: 5
  },
  {
    title: "Loose Leaf Tea: The Better Way to Brew",
    subtitle: "Ditch the paper bag dust and explore the rich aroma of whole leaf teas.",
    content: `
      <p>Most commercial tea bags are packed with "fannings" and "dust", the tiny leftover pieces of tea leaves after premium grades are sorted. These tiny pieces dry out quickly, losing their natural oils and leaving you with a bitter, flat brew. Loose leaf tea, on the other hand, consists of whole, unbroken leaves that unfold slowly in water, releasing a smooth, layered flavor profile.</p>
      <h3>The Art of Steeping Loose Leaves</h3>
      <p>To get the best cup, pay attention to water temperature and steeping time. Green teas are delicate and should be brewed with water below boiling (around 175°F) for 2 to 3 minutes to avoid bitterness. Black teas and herbal blends are sturdier and can handle water at a rolling boil (212°F) steeped for 4 to 5 minutes to extract their full flavor.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238649/Loose_Leaf_Tea_The_better_way_to_brew_bci789.jpg",
    readTime: 5
  },
  {
    title: "Cocoa Husk Tea",
    subtitle: "Discover the chocolatey, caffeine-free infusion made from roasted cacao shells.",
    content: `
      <p>Cocoa husk tea is a beautiful, sustainable infusion made from the outer shells of roasted cacao beans. During chocolate production, the beans are cracked open, and these husks are separated from the inner nibs. When steeped in hot water, the husks produce a light, tea-like liquid with a rich, comforting chocolate aroma and a delicate, sugar-free sweetness.</p>
      <h3>Health Benefits and Steeping</h3>
      <p>Cocoa husk tea is naturally caffeine-free but contains theobromine, a gentle stimulant that offers a smooth, jitter-free energy boost. Steep 2 teaspoons of cocoa husks in boiling water for 6 to 8 minutes. Enjoy it black for a clean chocolate water finish, or add a splash of almond milk and honey for a cozy evening treat.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238653/Cocoa_Husk_Tea_kjlysl.jpg",
    readTime: 4
  },
  {
    title: "Nacional Cacao: The Return of a Legend",
    subtitle: "The fascinating story of the rare Ecuadorian heirloom cacao once thought to be extinct.",
    content: `
      <p>Nacional cacao is legendary among chocolate lovers. Known for its intense floral aroma and low bitterness, it is one of the oldest and rarest heirloom varieties of cacao in the world. For over a century, it was believed to have been wiped out by disease, leaving chocolate makers to rely on hybrid varieties.</p>
      <h3>The Rediscovery</h3>
      <p>In 2009, researchers discovered wild, ancient cacao trees in a remote valley in Ecuador. DNA testing confirmed they were pure, unhybridized Nacional trees. Today, a small number of independent cooperatives harvest these beans, producing some of the most sought-after, aromatic single-origin chocolates in the world. Savoring Nacional cacao is a journey back in time, a taste of cacao as nature originally intended.</p>
    `,
    author: "Elena Rostova",
    category: "Culinary Journal",
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784238652/Nacional_Cacao_The_return_of_a_Legend_bw2qhg.jpg",
    readTime: 5
  }
];

const recipes = [
  {
    title: "Air Fryer Crispy Chickpeas",
    subtitle: "A crunchy, spice-roasted healthy snack made in minutes.",
    ingredients: "2 cups cooked chickpeas (rinsed and dried completely), 1 tbsp olive oil, 1 tsp ground cumin, 1 tsp smoked Spanish paprika, 1/2 tsp garlic powder, 1/2 tsp sea salt",
    instructions: `
      <p>Make sure your chickpeas are completely dry before you start. Roll them in a clean dish towel to absorb all moisture; this is the key to achieving ultimate crispiness.</p>
      <p>In a medium bowl, toss the dried chickpeas with olive oil until they are evenly coated.</p>
      <p>Preheat your air fryer to 390°F. Place the chickpeas in the air fryer basket in a single layer. Air fry for 12 to 15 minutes, shaking the basket every 5 minutes to ensure they crisp up evenly on all sides.</p>
      <p>While the chickpeas are frying, mix your cumin, smoked paprika, garlic powder, and sea salt in a small bowl.</p>
      <p>Immediately after removing the chickpeas from the air fryer, toss them in the spice mixture while they are hot. The oil will bond the spices to the chickpeas, creating a beautiful flavorful coating.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239996/Air_Fryer_difrb7.jpg",
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    method: "Air Fryer"
  },
  {
    title: "Artisanal Baking Sourdough",
    subtitle: "Mastering the gold crust bread with rosemary and sea salt.",
    ingredients: "500g bread flour, 350g warm water, 100g active sourdough starter, 10g fine sea salt, 2 tbsp fresh rosemary (finely chopped), 1 tbsp coarse sea salt (for topping)",
    instructions: `
      <p>In a large bowl, whisk the active starter and warm water together. Add the flour and mix until a shaggy dough forms. Let it rest (autolyse) for 30 minutes.</p>
      <p>Sprinkle the salt and chopped rosemary over the dough. Fold the dough over itself, kneading gently for 2 minutes to incorporate. Perform stretch-and-folds every 30 minutes for the next 2.5 hours.</p>
      <p>Let the dough bulk ferment at room temperature until it has increased in volume by 50% (about 4 to 6 hours depending on room temperature).</p>
      <p>Shape into a round boule, place in a floured proofing basket, and cold ferment in the refrigerator overnight (12 to 15 hours) to develop a deep sourdough tang.</p>
      <p>Preheat your oven and Dutch oven to 450°F. Score the top of the dough, sprinkle with coarse sea salt, transfer to the hot Dutch oven, and bake covered for 20 minutes. Remove the lid and bake for another 20 minutes until the crust is a deep golden brown.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239983/Baking_nx2rbr.jpg",
    prepTime: 45,
    cookTime: 40,
    servings: 8,
    difficulty: "Advanced",
    method: "Baking"
  },
  {
    title: "Cold Prep Spicy Cucumber Salad",
    subtitle: "A refreshing, garlic-tangy cold dish perfect for hot days.",
    ingredients: "3 large English cucumbers, 1 tbsp salt (for drawing water), 2 cloves garlic (grated), 2 tbsp soy sauce, 1 tbsp rice vinegar, 1 tbsp chili oil, 1 tsp toasted sesame seeds",
    instructions: `
      <p>Slice the cucumbers into thin rounds. Place them in a colander, sprinkle with salt, and toss. Let them stand for 20 minutes to draw out excess water, ensuring a crisp crunch.</p>
      <p>Rinse the cucumbers with cold water and dry them thoroughly with paper towels.</p>
      <p>In a small bowl, whisk together the grated garlic, soy sauce, rice vinegar, and chili oil.</p>
      <p>Toss the dried cucumbers in the dressing until fully coated. Transfer to a serving bowl and garnish with toasted sesame seeds. Chill in the refrigerator for 15 minutes before serving cold.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239984/Cold_Prep_glq2zh.jpg",
    prepTime: 25,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    method: "Cold Prep"
  },
  {
    title: "Deep Frying Golden Pakoras",
    subtitle: "Traditional spiced vegetable fritters fried to crisp perfection.",
    ingredients: "2 cups chickpea flour (besan), 1 cup water, 1 large potato (sliced paper-thin), 1 medium red onion (thinly sliced), 1 cup fresh spinach (chopped), 1 tsp ground cumin, 1 tsp turmeric, 1/2 tsp chili powder, vegetable oil (for deep frying)",
    instructions: `
      <p>In a large bowl, whisk chickpea flour, water, cumin, turmeric, chili powder, and a pinch of salt to form a thick, smooth batter (similar to pancake batter).</p>
      <p>Fold the sliced potato, onions, and chopped spinach into the batter until the vegetables are completely coated.</p>
      <p>Heat 2 inches of vegetable oil in a heavy Dutch oven or deep fryer to 350°F.</p>
      <p>Drop spoonfuls of the battered vegetable mixture into the hot oil. Fry in batches for 4 to 5 minutes, turning occasionally, until they are deep golden-brown and crispy. Drain on paper towels and serve hot with chutney.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239982/Deep_Frying_fxyov4.jpg",
    prepTime: 15,
    cookTime: 15,
    servings: 6,
    difficulty: "Medium",
    method: "Deep Frying"
  },
  {
    title: "Desserts: Spiced Berry Crumble",
    subtitle: "A comforting sweet fruit dessert infused with cinnamon and ginger.",
    ingredients: "4 cups mixed berries (fresh or frozen), 2 tbsp honey, 1 cup rolled oats, 1/2 cup almond flour, 1/4 cup coconut oil (melted), 1 tsp ground cinnamon, 1/2 tsp ground ginger, 1/4 tsp ground nutmeg",
    instructions: `
      <p>Preheat your oven to 350°F. In a 9x9 baking dish, toss the mixed berries with honey until evenly coated.</p>
      <p>In a medium bowl, mix together the rolled oats, almond flour, ground cinnamon, ground ginger, and ground nutmeg.</p>
      <p>Pour the melted coconut oil over the dry oat mixture and stir until clumps form.</p>
      <p>Scatter the spiced crumble topping evenly over the berries in the baking dish.</p>
      <p>Bake for 35 to 40 minutes, or until the fruit is bubbling at the edges and the crumble topping is a warm golden-brown. Serve warm.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239984/Desserts_tpatxs.jpg",
    prepTime: 10,
    cookTime: 40,
    servings: 6,
    difficulty: "Easy",
    method: "Desserts"
  },
  {
    title: "Drinks: Ginger-Mint Infused Tea",
    subtitle: "A refreshing herbal blend with citrus and aromatic honey.",
    ingredients: "2 inches fresh ginger root (sliced thin), 1/2 cup fresh mint leaves, 4 cups water, 1 fresh lemon (sliced), 2 tbsp raw honey",
    instructions: `
      <p>In a small saucepan, bring the thin slices of ginger and 4 cups of water to a boil over high heat.</p>
      <p>Reduce the heat to low and simmer the ginger for 10 minutes to extract its spicy warmth.</p>
      <p>Remove the pan from the heat, add the fresh mint leaves and lemon slices, cover, and let steep for 5 minutes.</p>
      <p>Strain the tea into a teapot or mugs and stir in the raw honey. Serve hot, or let it cool and pour over ice for a refreshing summer cooler.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784240073/pexels-kunal-lakhotia-781256899-36268520_cuz1zy.jpg",
    prepTime: 5,
    cookTime: 10,
    servings: 4,
    difficulty: "Easy",
    method: "Drinks"
  },
  {
    title: "Roasting: Garlic & Herb Potatoes",
    subtitle: "Crispy oven-roasted baby potatoes seasoned with thyme.",
    ingredients: "2 lbs baby yellow potatoes (halved), 2 tbsp olive oil, 4 cloves garlic (minced), 1 tbsp fresh thyme leaves, 1 tsp coarse sea salt, 1/2 tsp ground black pepper",
    instructions: `
      <p>Preheat your oven to 400°F. In a large bowl, toss the halved baby potatoes with olive oil, minced garlic, thyme, sea salt, and pepper.</p>
      <p>Arrange the seasoned potatoes in a single layer on a large rimmed baking sheet, cut-side down, to maximize browning.</p>
      <p>Roast for 30 to 35 minutes, tossing them halfway through, until the skins are crispy and golden and the insides are tender.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239984/Roasting_sajikn.jpg",
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: "Easy",
    method: "Roasting"
  },
  {
    title: "Salad: Mediterranean Chickpea Salad",
    subtitle: "A colorful, fiber-rich salad dressed in olive oil and sumac.",
    ingredients: "2 cups cooked chickpeas, 1 cup cherry tomatoes (halved), 1 English cucumber (diced), 1/2 cup red onion (finely diced), 1/2 cup Kalamata olives, 2 tbsp olive oil, 1 tbsp lemon juice, 1 tsp ground sumac, salt and pepper to taste",
    instructions: `
      <p>In a large serving bowl, combine the cooked chickpeas, halved cherry tomatoes, diced cucumber, red onion, and Kalamata olives.</p>
      <p>In a small cup, whisk together the olive oil, fresh lemon juice, ground sumac, salt, and pepper.</p>
      <p>Drizzle the sumac dressing over the salad and toss gently to coat all ingredients. Let it sit at room temperature for 10 minutes before serving to let the flavors blend.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239979/Salad_g8uoly.jpg",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    method: "Salad"
  },
  {
    title: "Sauces: Classic Cajun Aioli",
    subtitle: "A creamy, garlicky dip infused with Cajun blackening seasoning.",
    ingredients: "1 cup mayonnaise, 2 cloves garlic (grated), 1 tbsp lemon juice, 1.5 tsp Cajun blackening seasoning, 1/2 tsp Dijon mustard, salt to taste",
    instructions: `
      <p>In a medium bowl, combine the mayonnaise, grated garlic, lemon juice, Cajun blackening seasoning, and Dijon mustard.</p>
      <p>Whisk the ingredients vigorously until a smooth, uniform sauce forms.</p>
      <p>Taste and adjust salt as needed. Cover and refrigerate for at least 30 minutes before serving to allow the garlic and Cajun spices to bloom in the cream.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239978/Sauces_pj79uj.jpg",
    prepTime: 10,
    cookTime: 0,
    servings: 8,
    difficulty: "Easy",
    method: "Sauces"
  },
  {
    title: "Simmer/Braise: Slow-Cooked Cinnamon Beef",
    subtitle: "Tender beef chunks slow-simmered in a rich cardamom gravy.",
    ingredients: "2 lbs beef chuck (cut into 2-inch cubes), 2 tbsp vegetable oil, 1 large onion (chopped), 3 cloves garlic (minced), 1 cinnamon stick, 4 whole cardamom pods, 1 tsp ground cumin, 1 tsp turmeric, 2 cups beef bone broth",
    instructions: `
      <p>Heat vegetable oil in a heavy Dutch oven over high heat. Sear the beef chuck cubes in batches until browned on all sides. Remove beef and set aside.</p>
      <p>Turn the heat to medium. Add the chopped onion and garlic to the pan, cooking until softened (about 4 minutes).</p>
      <p>Stir in the cinnamon stick, whole cardamom pods, ground cumin, and turmeric. Toast the spices in the pan for 60 seconds until highly fragrant.</p>
      <p>Return the beef and its juices to the Dutch oven. Pour in the beef bone broth, scraping the bottom of the pan to release caramelized bits.</p>
      <p>Bring the pot to a boil, cover tightly, reduce heat to low, and simmer gently for 2 hours until the beef is incredibly tender and the gravy has thickened.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239980/SimmerBraise_avug7d.jpg",
    prepTime: 20,
    cookTime: 120,
    servings: 4,
    difficulty: "Medium",
    method: "Simmer/Braise"
  },
  {
    title: "Stir Fry: Ginger Garlic Tofu",
    subtitle: "A fast, healthy pan-fried dish loaded with fresh ground ginger.",
    ingredients: "1 block extra-firm tofu (pressed and cubed), 2 tbsp sesame oil, 1 tbsp fresh ginger root (grated), 3 cloves garlic (sliced thin), 2 cups broccoli florets, 1 red bell pepper (sliced), 2 tbsp soy sauce, 1 tbsp maple syrup",
    instructions: `
      <p>Heat 1 tablespoon of sesame oil in a large wok or skillet over medium-high heat. Add the cubed tofu and pan-fry for 8 to 10 minutes, flipping occasionally, until golden-brown and crispy. Transfer tofu to a plate.</p>
      <p>Add the remaining sesame oil to the hot wok. Add the grated ginger and sliced garlic, stir-frying for 30 seconds until aromatic.</p>
      <p>Toss in the broccoli florets and sliced red bell pepper, stir-frying for 4 minutes until they are tender-crisp.</p>
      <p>In a small cup, mix the soy sauce and maple syrup. Return the tofu to the wok, pour the sauce over, and stir-fry for 1 minute until glazed and hot.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239978/Stir_Fry_gbnr7h.jpg",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "Easy",
    method: "Stir Fry"
  },
  {
    title: "Stove Top: Aromatic Lentil Soup",
    subtitle: "A comforting bowl of yellow lentils simmered with cumin and turmeric.",
    ingredients: "1.5 cups dry yellow split peas or red lentils (rinsed), 1 tbsp coconut oil, 1 onion (diced), 2 tsp ground cumin, 1 tsp turmeric powder, 1/2 tsp ground coriander, 5 cups vegetable broth, 1 cup canned coconut milk",
    instructions: `
      <p>Heat coconut oil in a large soup pot over medium heat. Add the diced onion, sautéing until soft and translucent (about 5 minutes).</p>
      <p>Stir in the ground cumin, turmeric powder, and ground coriander, toasting the dry spices for 1 minute until fragrant.</p>
      <p>Add the rinsed yellow lentils and pour in the vegetable broth. Bring to a boil, then turn the heat to low, cover, and simmer for 25 to 30 minutes until the lentils are tender and falling apart.</p>
      <p>Stir in the coconut milk, season with salt and pepper to taste, and simmer for another 5 minutes before serving warm with flatbread.</p>
    `,
    imageUrl: "https://res.cloudinary.com/dawp1fcci/image/upload/f_auto,q_auto/v1784239980/Stove_Top_nev4hx.jpg",
    prepTime: 10,
    cookTime: 35,
    servings: 6,
    difficulty: "Easy",
    method: "Stove Top"
  }
];

function generateDetailedContent(title, baseContent) {
  const essayA = `
    <h3>I. The Chemistry of Volatile Spice Oils: The Invisible Flavor Engine</h3>
    <p>Every single spice in the human pantry is a sleeping reservoir of organic chemistry. Deep within the cell structures of seeds like cumin, barks like cinnamon, and pods like cardamom lies a delicate cocktail of volatile essential oils. In cinnamon, the primary driver is cinnamaldehyde; in black pepper, the pungent kick comes from piperine; in cloves, it is the intense aroma of eugenol. These chemical compounds are the true source of all flavor, heat, and wellness properties associated with spices. However, as their name suggests, these oils are highly volatile. The moment a spice is ground, its protective outer wall is broken, exposing these delicate compounds to light, heat, and oxygen.</p>
    <p>This exposure initiates a rapid evaporation process. Within months, pre-ground spices stored in grocery store plastic jars lose the majority of their native oils, turning into dusty, fibrous powders that add color to a dish but lack aromatic vitality. By transitioning to whole spices and grinding them fresh right before you cook, you ensure these volatile compounds release directly into your pan. This creates a multi-sensory cooking experience, rich aromas, deep warmth, and complex flavor notes that pre-ground alternatives simply cannot replicate. Understanding the science of these oils is the first step toward master-level cooking.</p>
    <p>To go deeper, these volatile oils have different flash points and solubilities. Many active flavor molecules, such as cuminaldehyde in cumin, are hydrophobic (fat-soluble). Shaking raw spice powder into boiling water locks these flavors away, whereas introducing them to hot fats like butter or olive oil dissolves the compounds, making them bioavailable to your taste buds. This explains why cuisines worldwide prioritize blooming spices in oil at the start of cooking.</p>
  `;

  const essayB = `
    <h3>II. Sourcing Integrity and Terroir: The Soil-to-Table Connection</h3>
    <p>Much like wine grapes, spices are deeply influenced by the soil, climate, and geography of where they are grown, a concept the French call <em>terroir</em>. The volcanic, nutrient-rich soils of Sumatra, Indonesia give Korintje cinnamon its deep, sweet woodiness, while the sun-drenched, arid plains of Extremadura, Spain impart a rich, sweet fruitiness to Spanish paprika. These distinct profiles are the result of centuries of agricultural adaptation, dependent on clean rain, ethical farming, and healthy soil ecosystems.</p>
    <p>Historically, the global spice trade has been dominated by long supply chains of brokers and middle-tier distributors. This setup often dilutes quality, as crops from different years and regions are blended together in bulk containers. Direct-sourcing cuts out these intermediaries, building direct partnerships with independent farming cooperatives. This direct relationship ensures that farmers are paid premium, fair-market wages, which they can reinvest in sustainable agricultural practices. For home cooks, this translates to spices that are fresh, potent, and sourced with respect for both the earth and the communities that harvest them.</p>
    <p>Moreover, direct sourcing supports agricultural crop diversity. Large commercial spice giants demand uniform crops, often encouraging monoculture farming that drains nutrients from the soil. Small, independent farms practice crop rotation, growing herbs and cover crops alongside primary spices. This biodiversity enhances the natural pest resistance of the plants, reducing the need for synthetic chemical sprays and promoting general soil health.</p>
  `;

  const essayC = `
    <h3>III. The Culinary Physics of Fat-Blooming: Activating Fat-Soluble Compounds</h3>
    <p>A common mistake in home kitchens is adding dry spices directly into a boiling, water-based liquid. While this may distribute color, it fails to activate the spice's full flavor potential. This is because the primary flavor compounds in spices are fat-soluble rather than water-soluble. To fully unlock their flavors, they must be heated in oil, butter, or ghee, a traditional culinary technique known as 'blooming' or 'tempering'.</p>
    <p>When spices are bloomed in hot fat, their essential oils dissolve into the fat molecules. Because fat coats the tongue, it distributes the spice flavors evenly across your palate, creating a longer-lasting and more cohesive flavor profile. To bloom spices correctly, heat your cooking fat over medium-low heat, add your spices, and stir constantly for 30 to 60 seconds. You will immediately notice a rich release of aromas. Be careful not to burn them, as the delicate sugars in spices can easily turn bitter if scorched. Once fragrant, add your wet ingredients (like onions, garlic, or tomatoes) to lower the pan's temperature and lock the seasoned oils into the base of your dish.</p>
    <p>The time you bloom also matters. Whole spices, like cumin seeds or cardamom pods, can stand up to several minutes of cooking in warm fat, slowly releasing their aromatic compounds. Ground spices, having a massive surface area, bloom almost instantly and can scorch within 20 seconds. Recognizing this difference is crucial for avoiding bitter, overcooked dishes.</p>
  `;

  const essayD = `
    <h3>IV. Designing the Modern Aromatic Pantry: Protection and Preservation Guidelines</h3>
    <p>Spices do not spoil or rot in a way that makes you sick, but they do fade. A jar of dried herbs from three years ago may still look green, but it likely tastes like dry straw. To protect your investment and ensure your dishes are packed with flavor, you must protect your spices from their four primary enemies: heat, light, moisture, and air.</p>
    <p>Storing your spice rack directly above or next to your stove is highly convenient, but the constant heat accelerates the breakdown of essential oils. Instead, store them in a cool, dark cabinet or drawer. Avoid using glass jars on open shelving exposed to direct sunlight, as light breaks down the organic chemical structures of spices. Finally, never shake a spice jar directly over a steaming pot, rising steam will introduce moisture to the jar, causing clumping and potential mold. Shake them into a spoon or your hand away from the steam instead to keep your pantry fresh and dry.</p>
    <p>Additionally, organizing your pantry by rotation rather than alphabetically can keep your ingredients fresh. Group your spices by season or frequency of use, keeping whole seeds at the front to encourage daily grinding, and using small airtight metal tins instead of plastic jars to completely block out degrading UV light.</p>
  `;

  const essayE = `
    <h3>V. The Art of Flavor Balancing: Harmony on the Palate</h3>
    <p>Culinary science defines flavor as a combination of basic tastes and aromas. Spices operate primarily in the aromatic realm, sending signals to the brain that shape our perception of a meal. Crafting a great spice blend is the art of balancing sweet, savory, earthy, and warm elements. For example, sweet spices like cinnamon and nutmeg contain high levels of eugenol, which adds warmth and complexity. When balanced with earthy spices like cumin and black pepper, they create a rich, savory depth that is perfect for stews, chilis, and roasted meats.</p>
    <p>When building a custom blend, think in layers: a foundational base (like turmeric or coriander) for body and color, a warm middle note (like cardamom or ginger) for complexity, and an assertive accent (like cayenne or black pepper) for heat. Experimenting with these ratios allows you to craft signature blends that balance and elevate your ingredients, turning everyday cooking into a celebration of flavor.</p>
    <p>Furthermore, balancing acidic notes is a powerful secret of professional chefs. Adding a squeeze of fresh lemon juice or a splash of vinegar at the very end of cooking highlights the spice notes, brightening the entire dish and preventing heavy, ground spices from tasting mud-like or overly heavy.</p>
  `;

  return `
    <div class="detailed-article-body">
      <div class="unique-article-intro">
        ${baseContent}
      </div>
      <hr class="article-inner-divider" style="margin: 3rem 0; border: 0; border-top: 1px solid #eeeeee;">
      <div class="expert-wisdom-chapters">
        <h2>Expert Culinary Wisdom & Guide Chapters</h2>
        <p style="font-style: italic; color: #666666; margin-bottom: 2rem;">As part of our commitment to authentic, human-led cooking, Spicery Co. provides detailed guide chapters with every article to help you master spice chemistry, sourcing, and preparation at home.</p>
        ${essayA}
        ${essayB}
        ${essayC}
        ${essayD}
        ${essayE}
      </div>
    </div>
  `;
}

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
    await Recipe.deleteMany({});

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
      blogData.content = generateDetailedContent(blogData.title, blogData.content);
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log(`${blogs.length} blog articles successfully seeded.`);

    // Seed Recipes
    console.log('Seeding recipe guides...');
    for (const recData of recipes) {
      recData.instructions = generateDetailedContent(recData.title, recData.instructions);
      const rec = new Recipe(recData);
      await rec.save();
    }
    console.log(`${recipes.length} recipe guides successfully seeded.`);

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

seed();
