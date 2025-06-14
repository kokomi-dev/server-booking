const express = require("express");
const blogController = require("../controllers/BlogController");
const route = express.Router();

route.post("/create", blogController.createBlog);
route.get("/:slug", blogController.getDetailBlog);
route.put("/edit/:id", blogController.editBlog);
route.delete("/delete", blogController.delBlog);
route.get("/", blogController.getAllBlog);
route.post("/likes/:id", blogController.updateLikeBlog);
route.post("/comments/:id", blogController.postCommentBlog);

module.exports = route;
