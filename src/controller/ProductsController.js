const Product = require("../model/Product");
const { uuid } = require("uuidv4");
const { mongooseArrays, mongoose } = require("../util/mongoose");
// get products
const getProducts = async (req, res, next) => {
  try {
    Product.find({deleted : false }).then((product) =>
      res.render("./products/products", {
        product: mongooseArrays(product),
      })
    );
  } catch {}
};
// create product
const createProducts = (req, res, next) => {
  res.render("./products/addproduct");
};
// handle event upload file image
const handleCreateProducts = async (req, res, next) => {
  const formData = req.body;
  formData.images = req.file.filename;
  formData.size = {
    length: req.body.size__length,
    width: req.body.size__width,
    height: req.body.size__height,
  };
  formData.id = await uuid();
  // new product
  const product = new Product(formData);
  product
    .save()
    .then(() => {
      res.redirect("/products");
    })
    .catch((error) => {
      console.log(error);
    });
};
// edit
const editProducts = async (req, res, next) => {
  try {
    await Product.findOne({ id: req.params.id }).then((product) =>
      res.render("./products/edit", { product: mongoose(product) })
    );
  } catch {}
};
// update
const updateProducts = async (req, res, next) => {
  try {
    await Product.updateOne({ id: req.params.id }, req.body);
    res.redirect("/products");
  } catch (error) {
    next(error);
  }
};
// delete
const deleteProduct = async (req, res, next) => {
  try{
    await Product.delete({id: req.params.id})
    .then(()=>{
      res.redirect("/products")
    })
    .catch(next)
  }
  catch{

  }
  console.log(req.params.id);
};
// trash
const trashProducts = async (req, res, next) => {
  try {
    Product.find({deleted : true }).then((product) =>
      res.render("./products/trash", {
        product: mongooseArrays(product),
      })
    );
  } catch {}
};
module.exports = {
  getProducts,
  createProducts,
  handleCreateProducts,
  editProducts,
  updateProducts,
  deleteProduct,
  trashProducts
};
