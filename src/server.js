const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const route = require("./routes/index");
const db = require("./db/db");
const app = express();
require("dotenv").config();

app.use(methodOverride("_method"));
// Middleware handle CORS
app.use(cors());
// Middleware  URL-encoded and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// route
route("/api/v1", app);
// Connect to mongodb
db.connect();
// run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
