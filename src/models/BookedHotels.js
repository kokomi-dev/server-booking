const mongoose = require("mongoose");
const bookedHotels = new mongoose.Schema({
  slugBooked: { type: String },
  infoUser: {
    idUser: { type: String },
    email: { type: String },
  },
  unitCode: { type: String },
  infoHotel: {
    name: { type: String },
    address: { type: String },
  },
  infoHotelRoom: [
    {
      id: { type: String },
      name: { type: String },
      numberBooked: { type: Number },
    },
  ],
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
  bookedDate: { type: Date },
  isSuccess: { type: Boolean },
});

module.exports = mongoose.model("BookedHotels", bookedHotels);
