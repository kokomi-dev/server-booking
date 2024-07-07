const mongoose = require("mongoose");
function connect() {
  mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => console.log("connect to database success"))
    .catch(() => console.log("connect to database false"));
}
module.exports = { connect };
