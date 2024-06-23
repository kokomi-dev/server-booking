const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Product = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  category: { type: String, require: true },
  des: { type: String, require: true },
  images: { type: Array, require: true },
  price: { type: String, require: true },
  sale: { type: Number || String },
  size: {
    length: { type: Number, require: true },
    width: { type: Number, require: true },
    height: { type: Number, require: true },
  },
  comment: [
    {
      body: String,
      date: Date,
    },
  ],
  evaluate: { type: Number },
  quantity_sold: { type: Number },
  slug: { type: String, slug: "id" },
  createdAt: { type: Date, date: Date.now() },
});

module.exports = mongoose.model("Product", Product);
