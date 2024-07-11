const express = require("express");
const route = express.Router();
const tourController = require("../controllers/TourController");
const upload = require("../middlewares/multerUpload");
route.get("/", tourController.getTours);
route.post("/", upload.array("images"), tourController.createTours);
route.put("/:id", upload.array("images"), tourController.updateTours);
route.delete("/:id", tourController.deleteTour);

module.exports = route;