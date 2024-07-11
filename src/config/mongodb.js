const { MongoClient } = require("mongodb");
const env = require("~/config/enviroment");

let dataResponseDatabase = null;

const client = new MongoClient(env.MONGODB_URL);

const CONNECT_DB = async () => {
  try {
    await client.connect();
    dataResponseDatabase = client.db(env.DATABASE_NAME);
  } catch (err) {
    console.log(err.stack);
  }
};
const GET_DB = () => {
  if (!dataResponseDatabase) {
    console.log("No data response from database( Mongo DB)");
  }
  return dataResponseDatabase;
};
module.exports = {
  CONNECT_DB,
  GET_DB,
};
