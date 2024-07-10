const express = require("express");
const hotelController = require("../controllers/HotelController");
const upload = require("../middlewares/multerUpload");

const route = express.Router();

route.get("/", hotelController.getHotel);
route.post("/", upload.array("images"), hotelController.createHotel);

module.exports = route;
