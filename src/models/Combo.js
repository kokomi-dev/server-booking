const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: { type: String, required: true },
  slug: { type: String, slug: "name" },
  id_combo: { type: Number, required: true },
  price_one: { type: Number, required: true },
  sales: { type: Number },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  details: [String],
});

module.exports = mongoose.model("Combo", comboSchema);
