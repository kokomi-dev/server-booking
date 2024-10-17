const mongoose = require("mongoose");
const User = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  img: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  numberPhone: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, date: Date.now() },
  updatedAt: { type: Date },
  booked: [
    {
      tripId: { type: String },
      category: { type: String },
      bookingDate: { type: Date },
      orderId: { type: String },
      amount: { type: Number },
    },
  ],
});

module.exports = mongoose.model("User", User);
