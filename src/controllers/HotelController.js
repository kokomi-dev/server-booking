const Hotel = require("../models/Hotel");
const { mongooseArrays } = require("../utils/mongoose");

const getHotel = async (req, res, next) => {
  try {
    const listQuery = {};
    const query = req.query;
    // limit
    const limit = parseInt(query.limit) || 10;
    if (query.trending === "true") {
      listQuery.isTrending = true;
    }
    const hotel = await Hotel.find(listQuery).limit(limit);
    // Send response
    if (tours.length > 0) {
      res.status(200).json({
        messages: "Lấy danh sách nhà nghỉ  thành công",
        data: mongooseArrays(tours),
      });
    } else {
      res.status(200).json({
        messages: "Không có tour nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};
const createHotel = async (req, res, next) => {
  try {
    const img = req.files.map((img) => img.path);
    const formData = req.body;
    formData.images = img;
    formData.createdAt = new Date().toLocaleDateString("vi-VN");
    const hotel = new Hotel(formData);
    hotel
      .save()
      .then(() => {
        res.status(200).json({
          messages: " tạo mới hotel thành công",
          hotel: hotel,
        });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    res.status(400).json({
      messages: " lỗi khi tạo mới hotel",
      error: error,
    });
  }
};
module.exports = {
  getHotel,
  createHotel,
};
