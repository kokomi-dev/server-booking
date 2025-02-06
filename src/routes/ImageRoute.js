const express = require("express");
const { delImageOnCloundinary } = require("../controllers/ImageController");
const route = express.Router();

route.post("/delete", delImageOnCloundinary);

module.exports = route;
