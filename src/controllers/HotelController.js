const { StatusCodes } = require("http-status-codes");
const Hotel = require("../models/Hotel");
const { mongooseArrays, mongoose } = require("../utils/mongoose");

const getHotel = async (req, res, next) => {
  try {
    const listQuery = {};
    const query = req.query;
    // limit
    const limit = parseInt(query.limit) || 10;
    if (query.fillter === "outstanding") {
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
      messages: "Lấy chi tiết hotel  thành công",
      data: mongoose(hotel),
    });
  } catch (error) {
    next(error);
  }
};

const createHotel = async (req, res) => {
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
const searchResult = async (req, res) => {
  try {
    const address = req.query.address;
    const hotel = await Hotel.find({
      "city-slug": address,
    });
    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách hotel ở " + address + " thành công",
      data: mongooseArrays(hotel),
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
const getHotelBooked = async (req, res) => {
  try {
    const arr = req.body.arr;

    const hotelBooked = await Hotel.find({
      _id: { $in: arr },
    });
    // Send response
    if (hotelBooked.length > 0) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách địa điểm tham quan đã đặt thành công",
        data: mongooseArrays(hotelBooked),
      });
    } else {
      res.status(StatusCodes.NO_CONTENT).json({
        messages:
          "Không có địa điểm tham quan nào đã được đặt nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    throw new Error("Lỗi khi gửi dữ liệu lên server");
  }
};
module.exports = {
  getHotel,
  getDetail,
  createHotel,
  searchResult,
  getHotelBooked,
};
