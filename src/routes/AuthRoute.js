const express = require("express");
const authController = require("../controllers/AuthController");
const upload = require("../middlewares/multerUpload");
const delayTime = require("~/middlewares/delayTime");

const route = express.Router();
route.get("/", authController.getAllUser);
route.post("/register", delayTime, authController.register);
route.post("/login", delayTime, authController.login);
route.get("/get-current-user", authController.getCurrentUser);
route.post("/update/:id", delayTime, authController.updateUser);
route.get("/logout", authController.logout);

module.exports = route;

// , upload.single()
