const express = require("express");
const authController = require("../controllers/AuthController");
const upload = require("../middlewares/multerUpload");

const route = express.Router();
route.get("/", authController.getAllUser);
route.post("/register", authController.register);
route.post("/login", authController.login);
route.get("/get-current-user", authController.getCurrentUser);
route.post("/update/:id", authController.updateUser);
route.get("/logout", authController.logout);

module.exports = route;

// , upload.single()
