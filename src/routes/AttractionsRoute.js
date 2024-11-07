const express = require("express");
const route = express.Router();
const attractionsController = require("../controllers/AttractionsController");
const attraction = require("~/validations/attractionValidation");
const upload = require("../middlewares/multerUpload");
// GET -api/tour - get data from table tours
route.get("/", attractionsController.getAttractions);
// GET -api/tour/searchresult?address=""
route.get("/searchresult", attractionsController.searchResult);
// GET -api/tour/:slug - get details tour
route.get("/:slug", attractionsController.getAttractionsDetail);
route.post("/getTourBooked", attractionsController.getAttractionBooked);
// POST -api/tour - add new tour
route.post(
  "/",
  upload.array("images", 5),
  // attraction.createAttraction,
  attractionsController.createAttraction
);
// GET -api/tour/create - get view handlebars create tour
route.get("/create", (req, res) => {
  res.render("tours/createTour.hbs");
});
// PUT -api/tour/:id - edit tour with the id-tour
route.put(
  "/:id",
  upload.array("images"),
  attractionsController.updateAttraction
);
// DELETE -api/tour - delete tour with id-tour
route.delete("/:id", attractionsController.deleteAttraction);

module.exports = route;
