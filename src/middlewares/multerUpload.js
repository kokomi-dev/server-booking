const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloundinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "img_tour_booking",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 1200, height: 1200, crop: "limit" }],
});

const upload = multer({ storage: storage });
module.exports = upload;
