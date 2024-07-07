const tourRoute = require("./TourRoute");
const authRoute = require("./AuthRoute");
function route(app) {
  app.use("/api/tour", tourRoute);
  app.use("/api/auth", authRoute);
}

module.exports = route;
