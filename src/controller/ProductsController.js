const Product = require("../model/Product");
const { uuid } = require("uuidv4");
const { mongooseArrays, mongoose } = require("../util/mongoose");

const getProducts = async (req, res, next) => {
  try {
    Product.find({}).then((product) => {
      if (product) {
        return res.status(200).json({
          messages: "get products success",
          data: mongooseArrays(product),
        });
      }
    });
  } catch (error) {
    console.log("error get products", error);
  }
};
const createProducts = async (req, res, next) => {
  try {
    const imgs = req.files.map((img) => img.path);
    const formData = req.body;
    formData.id = await uuid();
    formData.images = imgs;
    formData.size = {
      length: req.body.size__length,
      width: req.body.size__width,
      height: req.body.size__height,
    };
    formData.createAt = new Date().toLocaleDateString("vi-VN");
    // new product
    const product = new Product(formData);
    product
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
const updateProducts = async (req, res, next) => {
  try {
    await Product.updateOne({ id: req.params.id }, req.body);
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    await Product.delete({ id: req.params.id })
      .then(() => {})
      .catch(next);
  } catch {}
  console.log(req.params.id);
};
module.exports = {
  getProducts,
  updateProducts,
  deleteProduct,
  createProducts,
};
