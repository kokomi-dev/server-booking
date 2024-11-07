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
  bookedAttractions: [
    {
      tripId: { type: String },
      bookingDate: { type: Date },
      orderId: { type: String },
      amount: { type: Number },
    },
  ],
  bookedHotels: [
    {
      tripId: { type: String },
      bookingDate: { type: Date },
      orderId: { type: String },
      amount: { type: Number },
    },
  ],
  notifys: [
    {
      title: { type: String },
      time: { type: String },
      img: { type: String },
    },
  ],
  roles: { type: String, default: "normal" },
});

module.exports = mongoose.model("User", User);
