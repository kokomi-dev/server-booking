const Product = require("../model/Product");
const { mongooseArrays } = require("../util/mongoose");
const getHome = (req, res, next) => {
  Promise.all(
    [Product.find({deleted : false}).countDocuments(), 
    Product.find({deleted : true}).countDocuments()])
    .then((value) => {
      res.render("home", { coutProduct :value[0], coutTrashProduct : value[1] });
    })
    .catch(next);
};
const login = (req, res, next)=>{
}
module.exports = {
  getHome,
  login
};
