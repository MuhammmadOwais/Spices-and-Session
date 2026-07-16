const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  author: { type: String, default: 'Spicery Co. Staff' },
  category: { type: String, default: 'Recipes & Guides' },
  imageUrl: { type: String },
  readTime: { type: Number, default: 5 }, // in minutes
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
