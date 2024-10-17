const express = require("express");
const {
  sendComment,
  delelteComment,
} = require("../controllers/CommentController");
const route = express.Router();

route.post("/sendComment", sendComment);
route.post("/deleteComment", delelteComment);

module.exports = route;
