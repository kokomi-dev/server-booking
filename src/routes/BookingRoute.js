const express = require("express");
const bookingController = require("../controllers/BookingController");
const route = express.Router();

route.post("/create", bookingController.createBooked);
route.get("/attraction", bookingController.getBookedAttraction);
route.get("/hotel", bookingController.getBookedHotel);

module.exports = route;
