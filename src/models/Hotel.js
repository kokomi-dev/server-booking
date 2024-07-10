const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [String],
  location: { type: String, required: true },
  slug: { type: String, slug: "name" },
  price_one: { type: Number, required: true },
  city: { type: String, required: true },
  sales: { type: Number },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  details: [String],
  isFavorite: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Hotel", hotelSchema);
