const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");
const route = require("./routes/index");
const errorHandling = require("~/middlewares/errorHandling");
const env = require("~/config/enviroment");
const { CONNECT_DB } = require("~/config/mongosee");
const hbs = require("express-handlebars").engine;
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const axios = require("axios").default;
require("dotenv").config();

const START_SERVICE = () => {
  const app = express();
  app.use(cors());

  // view engine handlebars
  app.set("view engine", "hbs");
  app.engine(
    "hbs",
    hbs({
      extname: "hbs",
      defaultLayout: "main",
      layoutsDir: __dirname + "/views/layouts/",
      partialsDir: __dirname + "/views/partials/",
      helpers: {
        first_img: (images) => {
          return images[0];
        },
      },
    })
  );
  app.use(cookieParser());
  // Thiết lập thư mục views
  app.set("views", __dirname + "/views");
  app.use(express.static("public"));

  app.use(methodOverride("_method"));
  // Middleware  URL-encoded and JSON
  app.use(express.json()); // Hỗ trợ JSON payload
  app.use(express.urlencoded({ extended: true }));
  // route
  route(app);
  // middleware => handle event erros
  app.use(errorHandling);
  // listen server on the port local
  cron.schedule("*/14 * * * *", async () => {
    try {
      const response = await axios.get(
        `${process.env.LOCAL_HOST_PORT}/api/attraction/keep-server-live`
      );
      console.log("Pinged server:", response.data);
    } catch (error) {
      console.error("Error pinging server:", error.message);
    }
  });

  // handle ping server
  app.listen(env.LOCAL_PORT, () => {
    console.log(`3.Server is running  ${env.LOCAL_PORT}`);
  });
};
(async () => {
  try {
    console.log("1.Mongosee connecting mongodb atlas");
    await CONNECT_DB();
    console.log("2.Mongosee connected to mongodb atlas ");
    START_SERVICE();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
// node ./build/src/server.js
