const { string } = require("joi");
const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [String],
  type: { type: Number, required: true },
  location: {
    detail: { type: String },
    province_id: { type: String },
    district_id: { type: String },
    commune_id: { type: String },
  },
  slug: { type: String, slug: "name" },
  city: { type: String, required: true },
  cancelFree: { type: Boolean },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  details: { type: String, require: true },
  listRooms: [
    {
      name: { type: String },
      details: [String],
      price: { type: Number },
      sale: { type: Number },
      numberPeople: { type: Number },
      isAddChildren: { type: Boolean },
    },
  ],
  highlights: [String],
  includes: [String],
  isFavorite: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      idUser: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      nameShow: {
        type: String,
      },
      content: {
        type: String,
        required: true,
      },
      commentDate: {
        type: Date,
      },
      ratingVote: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Hotel", hotelSchema);
