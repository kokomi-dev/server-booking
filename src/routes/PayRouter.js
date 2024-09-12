const express = require("express");
const { sendRequestPay } = require("../controllers/PayController");
const route = express.Router();

route.post("/create-payment-url", sendRequestPay);

module.exports = route;
