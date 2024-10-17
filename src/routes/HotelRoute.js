const express = require("express");
const hotelController = require("../controllers/HotelController");
const upload = require("../middlewares/multerUpload");
const hotelValidations = require("../validations/hotelValidation");
const route = express.Router();

route.get("/", hotelController.getHotel);
route.get("/searchresult", hotelController.searchResult);
route.post("/getHotelBooked", hotelController.getHotelBooked);
route.get("/:slug", hotelController.getDetail);
route.get("/create", (req, res) => {
  res.render("hotels/createHotel.hbs");
});
route.post(
  "/",
  upload.array("images"),
  hotelValidations.createHotel,
  hotelController.createHotel
);
module.exports = route;
