const attractionRoute = require("./AttractionsRoute");
const authRoute = require("./AuthRoute");
const userRoute = require("./UserRoute");

const hotelRoute = require("./HotelRoute");
const comboRoute = require("./ComboRoute");
const emailRoute = require("./EmailRoute");
const payRouter = require("./PayRouter");
const commentRouter = require("./CommentRouter");
const blogRouter = require("./BlogRoute");
const imageRouter = require("./ImageRoute");
const bookingRouter = require("./BookingRoute");

function route(app) {
  app.use("/api/attraction", attractionRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/hotel", hotelRoute);
  app.use("/api/combo", comboRoute);
  app.use("/api/email", emailRoute);
  app.use("/api/pay", payRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/image", imageRouter);
  app.use("/api/booking", bookingRouter);
}

module.exports = route;
