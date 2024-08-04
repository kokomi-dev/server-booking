const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [String],
  type: { type: Number, required: true },
  location: { type: String, required: true },
  slug: { type: String, slug: "name" },
  price: [Number],
  city: { type: String, required: true },
  sales: { type: Number },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  details: { type: String, require: true },
  highlights: [String],
  isFavorite: {
    type: String,
    require: true,
  },
  comments: [
    {
      content: String,
      created: Date,
    },
  ],
});

module.exports = mongoose.model("Hotel", hotelSchema);
