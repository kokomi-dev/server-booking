require("dotenv").config();
const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  NODE_MODE: process.env.NODE_MODE,

  LOCAL_PORT: process.env.LOCAL_PORT,
  SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
  SECRET_KEY_JWT_REFRESHTOKEN: process.env.SECRET_KEY_JWT_REFRESHTOKEN,
};
module.exports = env;
