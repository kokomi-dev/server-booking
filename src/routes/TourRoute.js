const express = require("express");
const route = express.Router();
const tourController = require("../controllers/TourController");
const tourValidation = require("~/validations/tourValidation");
const upload = require("../middlewares/multerUpload");
// GET -api/tour - get data from table tours
route.get("/", tourController.getTours);
// GET -api/tour/:slug - get details tour
route.get("/:slug", tourController.getTourDetail);
// POST -api/tour - add new tour
route.post(
  "/",
  upload.array("images", 5),
  tourValidation.createTours,
  tourController.createTours
);
// GET -api/tour/create - get view handlebars create tour
route.get("/create", (req, res) => {
  res.render("tours/createTour.hbs");
});
// PUT -api/tour/:id - edit tour with the id-tour
route.put("/:id", upload.array("images"), tourController.updateTours);

// DELETE -api/tour - delete tour with id-tour
route.delete("/:id", tourController.deleteTour);

module.exports = route;
