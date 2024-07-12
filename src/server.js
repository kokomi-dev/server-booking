const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const route = require("./routes/index");
const errorHandling = require("~/middlewares/errorHandling");
const env = require("~/config/enviroment");
const { CONNECT_DB, GET_DB } = require("~/config/mongodb");

const START_SERVICE = () => {
  const app = express();

  app.use(methodOverride("_method"));
  // Middleware  URL-encoded and JSON
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  route(app);
  app.use(errorHandling);

  const PORT = env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`3. Server is running  ${PORT}`);
  });
};
(async () => {
  try {
    console.log("1. Connecting mongodb atlas");
    await CONNECT_DB();
    console.log("2. Connected to mongodb atlas successfully");
    START_SERVICE();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
