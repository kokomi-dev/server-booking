const mongoose = require("mongoose");
const bookedHotels = new mongoose.Schema({
  slugBooked: { type: String },
  idUser: { type: String, required: true },
  idUnit: { type: String },
  methodPayment: {
    type: { type: Number },
    name: { type: String },
  },
  paymentUrl: { type: String },
  totalBooked: { type: Number, required: true },
  infoRoomBooked: [
    {
      name: { type: String },
      numberAdult: { type: Number },
      numberChildren: { type: Number },
      price: { type: Number },
    },
  ],
  dateStay: { type: Date },
  bookedDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("BookedHotels", bookedHotels);
