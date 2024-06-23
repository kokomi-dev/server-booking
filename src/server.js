const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const route = require("./routes/index");
const db = require("./db/db");
const app = express();

require("dotenv").config();
app.use(methodOverride("_method"));
// Middleware  URL-encoded and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Connect to mongodb
db.connect();
// route
route(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
