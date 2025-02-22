const express = require("express");
const bookingController = require("../controllers/BookingController");
const route = express.Router();

route.post("/create", bookingController.createBooked);
route.get("/attraction", bookingController.getBookedAttraction);
route.post("/attraction/:id", bookingController.updateBookedAttraction);

route.get("/hotel", bookingController.getBookedHotel);
route.post("/hotel/:id", bookingController.updateBookedHotel);
route.get("/get-info/:id", bookingController.getInfoBooked);

module.exports = route;
