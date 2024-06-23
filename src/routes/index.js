const productRoute = require("./ProductsRoute");
const authRoute = require("./AuthRoute");
function route(app) {
  app.use("/api/products", productRoute);
  app.use("/api/auth", authRoute);
}

module.exports = route;
