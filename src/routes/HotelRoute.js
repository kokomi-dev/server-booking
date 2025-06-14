const express = require("express");
const hotelController = require("../controllers/HotelController");
const upload = require("../middlewares/multerUpload");
const hotelValidations = require("../validations/hotelValidation");
const route = express.Router();

route.post(
  "/",
  upload.array("images"),
  // hotelValidations.createHotel,
  hotelController.createHotel
);
route.get("/", hotelController.getHotel);
route.delete("/:slug", hotelController.deleteHotel);

route.get("/filter", hotelController.getFilterHotel);
route.put("/status", hotelController.updateStatusHotel);

route.get("/:slug", hotelController.getDetail);
route.put("/edit/:slug", upload.array("images"), hotelController.updateHotel);
route.post("/room/:slug", hotelController.createRoom);
route.put("/room/:slug", hotelController.updateRoom);
route.delete("/room", hotelController.deleteRoom);

module.exports = route;
