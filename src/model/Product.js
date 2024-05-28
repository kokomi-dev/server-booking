const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
var mongoose_delete = require('mongoose-delete');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const Product = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  category: { type: String },
  des: { type: String },
  images: { type: String },
  price: { type: String },
  sale: { type: Number },
  size: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  comment: [],
  evaluate: { type: Number },
  quantity_sold: { type: Number },
  slug: { type: String, slug: "id" },
});
Product.plugin(mongoose_delete,{
  overrideMethods: true,
  createdAt: true,
  deletedAt: true,
})
module.exports = mongoose.model("Product", Product);
