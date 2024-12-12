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
    if (hotel) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy chi tiết hotel  thành công",
        code: StatusCodes.OK,
        data: mongoose(hotel),
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy chi tiết chỗ nghỉ",
        code: StatusCodes.NOT_FOUND,
        data: null,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Đã xảy ra lỗi máy chủ",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

const createHotel = async (req, res) => {
  try {
    let infoRoom = [];
    Object.keys(req.body).forEach((key) => {
      const match = key.match(/^infoRoom\[(\d+)]\[(\w+)]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!infoRoom[index]) {
          infoRoom[index] = {
            name: "",
            detail: [],
            price: 0,
            numberPeople: 1,
            sale: 0,
            isAddChildren: false,
          };
        }
        infoRoom[index][field] = req.body[key];
      }
    });
    infoRoom.forEach((room) => {
      room.price = parseFloat(room.price);
      room.numberPeople = parseInt(room.numberPeople, 10);
      room.sale = parseFloat(room.sale);
      room.isAddChildren === "false" ? false : true;
    });

    const formData = {
      ...req.body,
      images: req.files.map((img) => img.path),
      createdAt: new Date().toLocaleDateString("vi-VN"),
      cancelFree: req.body.cacelFree === "false" ? false : true,
      type: Number(req.body.type),
      comments: [],
      listRooms: req.body.infoRoom,
      location: {
        detail: parseInt(req.body.location_detail),
        province_id: parseInt(req.body.location_province_id),
        district_id: parseInt(req.body.location_district_id),
        commune_id: parseInt(req.body.location_commune_id),
      },
      isFavorite: false,
    };
    const hotel = new Hotel(formData);
    await hotel.save();
    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      messages: "tạo mới hotel thành công",
      hotel: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
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
      res.status(StatusCodes.NOT_FOUND).json({
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
