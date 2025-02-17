const mongoose = require("mongoose");
const bookedAttractions = new mongoose.Schema({
  slugBooked: { type: String },
  idUser: { type: String, required: true },
  unitCode: { type: String },
  paymentMethod: {
    type: String,
    enum: ["zalopay", "credit-card", "cod", "banking-tranfer"],
  },
  paymentUrl: { type: String },
  totalBooked: { type: Number, required: true },
  numberOfTicketsBooked: {
    adult: { type: Number },
    children: { type: Number },
  },
  dateStart: { type: Date },
  hourStart: { type: String },
  bookedDate: { type: Date },
});

module.exports = mongoose.model("BookedAttractions", bookedAttractions);
