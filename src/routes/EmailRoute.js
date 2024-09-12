const express = require("express");
const { sendEmail } = require("../controllers/EmailController");
const route = express.Router();

route.post("/send-email", sendEmail);

module.exports = route;
