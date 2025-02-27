const express = require("express");
const route = express.Router();
const attractionsController = require("../controllers/AttractionsController");
const attraction = require("~/validations/attractionValidation");
const upload = require("../middlewares/multerUpload");
// GET -api/tour - get data from table tours
route.get("/", attractionsController.getAttractions);
route.get("/keep-server-live", (req, res) => {
  res.status(200).json({
    code: 200,
    message: "server đã được ping đến",
    data: [
      {
        query: "access thành cống",
      },
    ],
  });
});
// GET -api/tour/searchresult?address=""
route.get("/filter", attractionsController.getFilterAttractions);
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

// Update status
route.put("/status", attractionsController.updateStatusAttraction);

// PUT -api/tour/:id - edit tour with the id-tour
route.put(
  "/:id",
  upload.array("images"),
  attractionsController.updateAttraction
);
// DELETE -api/tour - delete tour with id-tour
route.delete("/:id", attractionsController.deleteAttraction);

module.exports = route;
