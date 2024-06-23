const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../util/cloundinary");

const upload = async () => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "uploads-img",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  });

  const upload = multer({ storage: storage });
};
module.exports = upload;
