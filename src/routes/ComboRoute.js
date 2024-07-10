const express = require("express");
const comboController = require("../controllers/ComboController");
const upload = require("../middlewares/multerUpload");

const route = express.Router();

route.post("/register", upload.single(), comboController.getCombo);

module.exports = route;
