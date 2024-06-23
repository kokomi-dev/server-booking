const mongoose = require("mongoose");
const User = new mongoose.Schema({
  name: { type: String, require: true },
  img: { type: String, require: true },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: { type: String, require: true },
  role: { type: String, default: "member" },
  createdAt: { type: Date, date: Date.now() },
});

module.exports = mongoose.model("User", User);
