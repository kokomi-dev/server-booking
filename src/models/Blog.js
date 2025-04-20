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
    type: Date,
  },
  updatedAt: {
    type: Date,
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
  isToday: {
    type: Boolean,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      idUser: { type: String, required: true },
      name: { type: String, required: true },
      nameShow: { type: String, required: true },
      email: { type: String, required: true },
      roles: { type: String, required: true },
      content: { type: String, required: true },
      commentDate: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
