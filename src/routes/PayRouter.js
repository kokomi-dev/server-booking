const express = require("express");
const {
  sendRequestPay,
  callbackPay,
  checkOrderPay,
  checkOrderPayHotel,
} = require("../controllers/PayController");
const route = express.Router();

route.post("/create-payment-url", sendRequestPay);
// route.post("/callback-payment-url", callbackPay);
route.post("/checkorder-payment", checkOrderPay);
route.post("/checkorder-payment-hotel", checkOrderPayHotel);

module.exports = route;
