const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const blogSchema = new mongoose.Schema({
  unitCode: { type: String, required: true },
  unitName: { type: String, required: true },

  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: { type: String, slug: "title" },
  content: { type: String, required: true },
  author: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  tags: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String || null,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isDraft: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isApprove: {
    type: Boolean,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
