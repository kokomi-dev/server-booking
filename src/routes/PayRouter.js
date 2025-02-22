const express = require("express");
const { sendRequestPay, callbackPay } = require("../controllers/PayController");
const route = express.Router();

route.post("/create-payment-url", sendRequestPay);
route.post("/callback-payment-url", callbackPay);

module.exports = route;
