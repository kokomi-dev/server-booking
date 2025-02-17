const express = require("express");
const bookingController = require("../controllers/BookingController");
const route = express.Router();

route.post("/create", bookingController.createBooked);

module.exports = route;
