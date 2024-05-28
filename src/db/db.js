const mongoose = require("mongoose");
function connect() {
  mongoose
    .connect("mongodb://localhost:27017/ecommerce-sofa")
    .then(() => console.log("connect to server success"))
    .catch(() => console.log("connect to serser false"));
}
module.exports = { connect };
