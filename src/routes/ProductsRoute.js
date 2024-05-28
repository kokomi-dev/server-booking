const express = require("express");
const route = express.Router();
const multer = require("multer");
const productController = require("../controller/ProductsController");
// config upload images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage });
route.get("/", productController.getProducts);
route.get("/create", productController.createProducts);
route.get("/:id/edit", productController.editProducts);
route.get("/trash", productController.trashProducts);
route.put(
  "/:id",
  upload.single("image-product"),
  productController.updateProducts
);
route.post(
  "/create-product",
  upload.single("image-product"),
  productController.handleCreateProducts
);
route.delete("/:id", productController.deleteProduct);
module.exports = route;
