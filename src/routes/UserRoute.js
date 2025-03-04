const express = require("express");
const userController = require("../controllers/UserController");

const route = express.Router();
route.delete("/dell-user/:id", userController.delUser);
route.post("/update", userController.updateUser);

module.exports = route;
