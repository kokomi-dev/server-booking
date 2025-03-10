const mongoose = require("mongoose");
const bookedAttractions = new mongoose.Schema({
  slugBooked: { type: String },
  infoAttraction: {
    name: { type: String },
    address: { type: String },
  },
  infoUser: {
    idUser: { type: String },
    name: { type: String },
    email: { type: String },
  },
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
  pickUpPoint: { type: String },
  isSuccess: { type: Boolean },
  note: { type: String },
});

module.exports = mongoose.model("BookedAttractions", bookedAttractions);
