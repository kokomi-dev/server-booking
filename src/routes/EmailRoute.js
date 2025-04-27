const express = require("express");
const {
  sendEmail,
  sendEmailTicket,
  sendEmailChangePassword,
} = require("../controllers/EmailController");
const route = express.Router();

route.post("/send-email", sendEmail);
route.post("/send-email-tickets", sendEmailTicket);
route.post("/send-email-change-password", sendEmailChangePassword);

module.exports = route;
