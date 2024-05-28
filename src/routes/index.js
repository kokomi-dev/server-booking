const productRoute = require("./ProductsRoute");
const siteRoute = require("./SiteRoute");
const userRoute = require("./UserRoute");
function route(app) {
  app.use("/products", productRoute);
  app.use("/users", userRoute);
  app.use("/", siteRoute);
}
module.exports = route;
