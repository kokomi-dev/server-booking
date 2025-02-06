const mongoose = require("mongoose");
const bookedAttractions = new mongoose.Schema({
  slugBooked: { type: String },
  idUser: { type: String, required: true },
  idUnit: { type: String },
  paymentUrl: { type: String },
  totalBooked: { type: Number, required: true },
  numberOfTicketsBooked: {
    adult: { type: Number },
    children: { type: Number },
  },
  dateStart: { type: Date },
  bookedDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("BookedAttractions", bookedAttractions);
