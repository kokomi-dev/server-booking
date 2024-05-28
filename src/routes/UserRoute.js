const express = require("express");
const userController = require("../controller/UserController");
const route = express.Router();
route.get("/", userController.getUser);
module.exports = route;
