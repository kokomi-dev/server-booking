const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: "name",
  },
  duration: {
    type: Number,
  },
  city: {
    type: String,
    required: true,
  },
  "city-slug": {
    type: String,
    required: true,
  },
  schedule: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  price: [
    {
      type: Number,
      required: true,
    },
  ],
  location: {
    province_id: { type: String },
    district_id: { type: String },
    commune_id: { type: String },
    detail: { type: String },
  },
  createdAt: {
    type: String,
  },
  startDate: {
    type: String,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  isTrending: {
    type: Boolean,
    required: true,
  },
  cancelFree: { type: Boolean, required: true },
  rating: {
    type: Number,
    default: 4.5,
  },
  guides: {
    type: String,
    required: true,
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
  images: [String],
  included: [String],
});

module.exports = mongoose.model("Attraction", attractionSchema);
