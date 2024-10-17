const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const route = require("./routes/index");
const errorHandling = require("~/middlewares/errorHandling");
const env = require("~/config/enviroment");
const { CONNECT_DB } = require("~/config/mongosee");
const hbs = require("express-handlebars").engine;
const cookieParser = require("cookie-parser");

const path = require("path");
const START_SERVICE = () => {
  const app = express();

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
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  // route
  route(app);
  // middleware => handle event erros
  app.use(errorHandling);
  // listen server on the port local
  const PORT = env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`3.Server is running  ${PORT}`);
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
