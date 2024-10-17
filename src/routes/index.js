const attractionRoute = require("./AttractionsRoute");
const authRoute = require("./AuthRoute");
const hotelRoute = require("./HotelRoute");
const comboRoute = require("./ComboRoute");
const emailRoute = require("./EmailRoute");
const payRouter = require("./PayRouter");
const commentRouter = require("./CommentRouter");
function route(app) {
  app.use("/api/attraction", attractionRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/hotel", hotelRoute);
  app.use("/api/combo", comboRoute);
  app.use("/api/email", emailRoute);
  app.use("/api/pay", payRouter);
  app.use("/api/comment", commentRouter);

  app.use("/api/views-dashboard", (req, res) => {
    res.render("home");
  });
}

module.exports = route;
