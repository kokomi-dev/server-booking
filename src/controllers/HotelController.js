const { StatusCodes } = require("http-status-codes");
const Hotel = require("../models/Hotel");
const { mongooseArrays, mongoose } = require("../utils/mongoose");

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
    if (hotel.length > 0) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách nhà nghỉ  thành công",
        data: mongooseArrays(hotel),
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        messages: "Không có hotel nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};
const getDetail = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const hotel = await Hotel.findOne({
      slug: slug,
    }).exec();
    res.status(StatusCodes.OK).json({
      messages: "Lấy chi tiết hotel du lịch thành công",
      data: mongoose(hotel),
    });
  } catch (error) {
    next(error);
  }
};
const createHotel = async (req, res, next) => {
  try {
    const formData = {
      ...req.body,
      images: req.files.map((img) => img.path),
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };
    const hotel = new Hotel(formData);
    hotel.save();
    res.status(StatusCodes.CREATED).json({
      messages: "tạo mới hotel thành công",
      hotel: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      messages: "lỗi khi tạo mới hotel",
      error: error.message,
    });
  }
};
module.exports = {
  getHotel,
  getDetail,
  createHotel,
};
