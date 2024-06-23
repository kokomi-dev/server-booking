const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
var mongoose_delete = require("mongoose-delete");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const Product = new Schema({
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
  createdAt: { type: Date },
});
Product.plugin(mongoose_delete, {
  overrideMethods: true,

  deletedAt: true,
});
module.exports = mongoose.model("Product", Product);
