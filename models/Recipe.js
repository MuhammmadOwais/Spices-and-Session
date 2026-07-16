const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  subtitle: { type: String },
  ingredients: { type: String, required: true }, // Comma-separated or HTML list of ingredients
  instructions: { type: String, required: true }, // Detailed step-by-step cooking directions
  imageUrl: { type: String },
  prepTime: { type: Number, default: 15 }, // in minutes
  cookTime: { type: Number, default: 15 }, // in minutes
  servings: { type: Number, default: 4 },
  difficulty: { type: String, default: 'Easy' }, // Easy, Medium, Advanced
  method: { type: String }, // e.g. Air Fryer, Baking, etc.
  author: { type: String, default: 'Chef Elena Rostova' }
});

recipeSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);
