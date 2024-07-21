const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: "name",
  },
  city: {
    type: String,
    required: true,
  },
  arena: {
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
    type: String,
    required: true,
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
    enum: ["dễ", "trung bình", "khó"],
    required: true,
  },
  isTrending: {
    type: Boolean,
    required: true,
  },
  ratingsQuantity: {
    type: Number,
    default: 4.5,
  },
  guides: {
    type: String,
    required: true,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  images: [String],
  included: [String], // Các dịch vụ bao gồm trong tour
});

module.exports = mongoose.model("Tour", tourSchema);
