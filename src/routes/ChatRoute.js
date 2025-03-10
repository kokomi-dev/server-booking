const express = require("express");
const chatController = require("../controllers/ChatController");

const route = express.Router();
route.post("/send-message", chatController.sendMessage);

module.exports = route;
