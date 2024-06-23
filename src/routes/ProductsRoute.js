const express = require("express");
const route = express.Router();
const productController = require("../controller/ProductsController");
const upload = require("../middleware/multerUpload");
route.get("/", productController.getProducts);
route.post(
  "/",
  upload.fields("image", { maxCount: 4 }),
  productController.createProducts
);
route.put("/:id", productController.updateProducts);
route.delete("/:id", productController.deleteProduct);

module.exports = route;
