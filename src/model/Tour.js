const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
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
    details: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    isTrending: {
      type: Boolean,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
    highlights: [String], // Các điểm nổi bật của tour
    itinerary: [String], // Lịch trình tour
    included: [String], // Các dịch vụ bao gồm trong tour
  },
  {
    // timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Tour", tourSchema);
