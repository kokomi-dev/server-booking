const express = require("express");
const {
  sendEmail,
  sendEmailTicket,
} = require("../controllers/EmailController");
const route = express.Router();

route.post("/send-email", sendEmail);
route.post("/send-email-tickets", sendEmailTicket);

module.exports = route;
