const express = require("express");
const authController = require("../controllers/AuthController");
const upload = require("../middlewares/multerUpload");
const delayTime = require("~/middlewares/delayTime");

const route = express.Router();
route.get("/", authController.getAllUser);
route.post("/register", delayTime, authController.register);
route.post("/refresh-token", authController.refreshToken);

route.post("/login", delayTime, authController.login);
route.post("/get-current-user", authController.getCurrentUser);
route.post("/update/:id", delayTime, authController.updateUser);
route.put("/update-status", authController.updateStatus);

route.get("/logout", authController.logout);

module.exports = route;

// , upload.single()
