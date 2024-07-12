const env = require("~/config/enviroment");
const mongoose = require("mongoose");

const CONNECT_DB = async () => {
  try {
    await mongoose.connect(`${env.MONGODB_URL}${env.DATABASE_NAME}`);
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = {
  CONNECT_DB,
};
