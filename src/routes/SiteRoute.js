const express = require("express");
const route = express.Router();
const siteController = require("../controller/SiteController");

route.get("/home", siteController.getHome);
route.get("/", siteController.login);


module.exports = route;
