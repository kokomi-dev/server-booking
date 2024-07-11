require("dotenv").config();
const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PORT: 8080,
  DATABASE_NAME: process.env.DATABASE_NAME,
};
module.exports = env;
