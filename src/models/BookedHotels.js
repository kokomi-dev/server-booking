const mongoose = require("mongoose");
const bookedHotels = new mongoose.Schema({
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
  dateTo: { type: Date },
  dateFrom: { type: Date },
  numberRoom: { type: Number },
  bookedDate: { type: Date },
});

module.exports = mongoose.model("BookedHotels", bookedHotels);
