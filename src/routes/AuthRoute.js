const express = require("express");
const authController = require("../controller/AuthController");
const isAuthenticated = require("../middleware/isAuthenticated");

const route = express.Router();

route.post("/resgiter", authController.resgister);
route.get("/login", authController.login);

module.exports = route;
