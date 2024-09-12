const express = require("express");
const authController = require("../controllers/AuthController");
const upload = require("../middlewares/multerUpload");

const route = express.Router();

route.post("/register", authController.register);
route.post("/login", authController.login);
route.get("/get-current-user", authController.getCurrentUser);

module.exports = route;

// , upload.single()
