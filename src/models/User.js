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
  idCode: { type: String },
  numberPhone: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  notifys: [
    {
      title: { type: String },
      time: { type: String },
      img: { type: String },
    },
  ],
  isActive: { type: Boolean, required: true },
  isUnitActive: { type: Boolean },
  roles: {
    type: String,
    required: true,
    enum: ["admin", "partner", "custommer"],
  },
  groupId: [String],
  infoUnit: {
    activityArena: [String],
    unitName: { type: String },
    unitAddress: { type: String },
    unitTaxCode: { type: String },
  },
  numberOfBooked: {
    attraction: { type: Number },
    hotel: { type: Number },
    bookedDateLatest: { type: Date },
  },
});

module.exports = mongoose.model("User", User);
