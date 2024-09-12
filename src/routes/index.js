const tourRoute = require("./TourRoute");
const authRoute = require("./AuthRoute");
const hotelRoute = require("./HotelRoute");
const comboRoute = require("./ComboRoute");
const emailRoute = require("./EmailRoute");
const payRouter = require("./PayRouter");
function route(app) {
  app.use("/api/tour", tourRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/hotel", hotelRoute);
  app.use("/api/combo", comboRoute);
  app.use("/api/email", emailRoute);
  app.use("/api/pay", payRouter);
  app.use("/api/views-dashboard", (req, res) => {
    res.render("home");
  });
}

module.exports = route;
