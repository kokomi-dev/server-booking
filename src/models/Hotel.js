const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const hotelSchema = new mongoose.Schema({
  unitCode: { type: String, required: true },
  name: { type: String, required: true },
  images: [String],
  type: { type: Number, required: true },
  location: {
    province: {
      id: { type: String },
      name: { type: String },
    },
    district: {
      id: { type: String },
      name: { type: String },
    },
    commune: {
      id: { type: String },
      name: { type: String },
    },
    detail: { type: String },
  },
  slug: { type: String, slug: "name" },
  city: { type: String, required: true },
  cancelFree: { type: Boolean },
  rating: { type: Number, required: true },
  createdAt: { type: String },
  updatedAt: { type: String },
  details: { type: String, require: true },
  listRooms: [
    {
      name: { type: String },
      details: { type: String },
      price: { type: Number },
      sale: { type: Number },
      numberPeople: { type: Number },
      isAddChildren: { type: Boolean },
      isActive: { type: Boolean },
      numberOfRoom: { type: Number },
      numberOfRoomBooked: { type: Number },
    },
  ],
  highlights: [String],
  includes: [String],
  isFavorite: { type: Boolean, default: false },
  comments: [
    {
      idUser: { type: mongoose.Schema.ObjectId, ref: "User" },
      name: { type: String },
      nameShow: { type: String },
      content: { type: String, required: true },
      commentDate: { type: String },
      ratingVote: { type: Number },
    },
  ],
  isActive: { type: Boolean },
});

module.exports = mongoose.model("Hotel", hotelSchema);
