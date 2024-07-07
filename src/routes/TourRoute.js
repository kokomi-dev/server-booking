const express = require("express");
const route = express.Router();
const tourController = require("../controller/TourController");
const upload = require("../middleware/multerUpload");
route.get("/", tourController.getTours);
route.get("/:condition", tourController.getToursWithCondition);

route.post("/", upload.array("images"), tourController.createTours);
route.put("/:id", upload.array("images"), tourController.updateTours);
route.delete("/:id", tourController.deleteTour);

module.exports = route;
