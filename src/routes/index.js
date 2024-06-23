const productRoute = require("./ProductsRoute");
const userRoute = require("./UserRoute");
const authRoute = require("./AuthRoute");
function route(app) {
  app.use("/products", productRoute);
  app.use("/users", userRoute);
  app.use("/", authRoute);
}
module.exports = route;
