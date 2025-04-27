const express = require("express");
const {
  sendComment,
  delelteComment,
  editComment,
} = require("../controllers/CommentController");
const route = express.Router();

route.post("/sendComment", sendComment);
route.post("/deleteComment", delelteComment);
route.post("/editComment", editComment);

module.exports = route;
