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
    province: {
      id: Number,
      name: String,
    },
    district: {
      id: Number,
      name: String,
    },
    commune: {
      id: Number,
      name: String,
    },
    detail: String,
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
  included: [String], // Các dịch vụ bao gồm trong tour
});

module.exports = mongoose.model("Attraction", attractionSchema);
