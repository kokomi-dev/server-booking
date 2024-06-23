const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const User = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: Date },
});

module.exports = mongoose.model("User", User);
