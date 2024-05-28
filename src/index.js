const express = require("express");
const exphbs = require("express-handlebars");
const cors = require("cors");
const morgan = require('morgan')
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const route = require("./routes/index");
const db = require("./db/db");

const app = express();

// Middleware handle method override
app.use(methodOverride("_method"));

// Middleware handle CORS
app.use(cors());
// app.use(morgan('combined'))
// Middleware  URL-encoded and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// View engine Handlebars
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
    defaultLayout: "index",
    helpers: {
      indexPlusOne: function (index) {
        return index + 1;
      },
      eq: function (v1, v2) {
        return v1 === v2;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// Static files from folder public
app.use(express.static(path.join(__dirname, "public")));

// route
route(app);

// Connect to mongodb
db.connect();

// run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
