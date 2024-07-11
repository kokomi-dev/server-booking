const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const route = require("./routes/index");
import errorHandling from "~/middlewares/errorHandling";
const db = require("./db/db");
const app = express();
require("dotenv").config();
app.use(methodOverride("_method"));
// Middleware  URL-encoded and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Connect to mongodb
db.connect();
// route
route(app);
app.use(errorHandling);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running  ${PORT}`);
});
