const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  mainCategoryGroup: { type: String },
  sizes: { type: [String], default: ['2 oz Jar', '4 oz Flatpack', '1 lb Bulk'] },
  imageUrl: { type: String },
  ingredients: { type: String },
  isFeatured: { type: Boolean, default: false },
  stockStatus: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], default: 'in-stock' },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
