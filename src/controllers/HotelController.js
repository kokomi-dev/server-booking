const { StatusCodes } = require("http-status-codes");
const Hotel = require("../models/Hotel");
const { mongooseArrays, mongoose } = require("../utils/mongoose");

const getHotel = async (req, res) => {
  try {
    const query = req.query;
    if (query.roles && query.idCode) {
      let hotels = null;
      switch (query.roles) {
        case "admin": {
          hotels = await Hotel.find();
          break;
        }
        case "partner": {
          hotels = await Hotel.find({ unitCode: query.idCode });
          break;
        }
        default:
          return res.status(StatusCodes.BAD_REQUEST).json({
            messages: "Vai trò không hợp lệ",
            code: StatusCodes.BAD_REQUEST,
          });
      }

      if (hotels.length > 0) {
        res.status(StatusCodes.OK).json({
          messages: "Lấy danh sách địa điểm lưu trú thành công",
          data: mongooseArrays(hotels),
          code: StatusCodes.OK,
        });
      } else {
        res.status(StatusCodes.OK).json({
          messages: "Không có địa điểm lưu trú nào được tìm thấy",
          data: [],
          code: StatusCodes.OK,
        });
      }
    } else {
      const listQuery = {};
      const limit = parseInt(query.limit) || 10;
      if (query.fillter === "outstanding") {
        listQuery.isTrending = true;
      }
      const hotel = await Hotel.find(listQuery).limit(limit);
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
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi khi kết nối đến server",
      code: StatusCodes.BAD_REQUEST,
    });
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
        detail: req.body.location_detail,
        province: {
          id: req.body.location_province_id,
          name: req.body.location_province_name,
        },
        district: {
          id: req.body.location_district_id,
          name: req.body.location_district_name,
        },
        commune: {
          id: req.body.location_commune_id,
          name: req.body.location_commune_name,
        },
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
const createRoom = async (req, res) => {
  const id = req.params.slug;
  const data = {
    ...req.body,
    isAddChildren: req.body.isAddChildren === "" ? false : true,
    isActive: true,
  };
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      id,
      {
        $push: { listRooms: data },
        $set: { updatedAt: new Date().toLocaleDateString("vi-VN") },
      },
      {
        new: true,
        lean: true,
      }
    );
    res.status(StatusCodes.OK).json({
      message: "Thêm thành công phòng",
      code: StatusCodes.OK,
      hotel: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      messages: "lỗi khi tạo mới phòng",
      error: error.message,
    });
  }
};
const updateRoom = async (req, res) => {
  const id = req.params.slug;
  const data = req.body;
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { _id: id, "listRooms._id": data.id },
      {
        $set: data.data,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      message: "Cập nhật thành công phòng",
      code: StatusCodes.OK,
      hotelUpdate: hotel,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      messages: "lỗi khi cập nhật thông tin phòng",
      error: error.message,
    });
  }
};
const deleteHotel = async (req, res) => {
  const id = req.params.slug;

  try {
    await Hotel.findOneAndDelete({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Xóa thành công nơi lưu trú",
      code: StatusCodes.OK,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      messages: "Lỗi khi xóa nơi lưu trú",
      error: error.message,
    });
  }
};
const deleteRoom = async (req, res) => {
  const idHotel = req.query.idHotel;
  const idRoom = req.query.idRoom;

  try {
    await Hotel.findOneAndUpdate(
      { _id: idHotel },
      { $pull: { listRooms: { _id: idRoom } } },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      message: "Xóa thành công phòng",
      code: StatusCodes.OK,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      messages: "lỗi khi xóa phòng trong nơi lưu trú",
      error: error.message,
    });
  }
};
const updateHotel = async (req, res) => {
  try {
    const { slug } = req.params;
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
      images: [...req.body?.images, ...req?.files.map((img) => img.path)],
      cancelFree: req.body.cancelFree === "false" ? false : true,
      type: Number(req.body.type),
      listRooms: req.body.infoRoom,
      location: {
        detail: req.body.location_detail,
        province: {
          id: req.body.location_province_id,
          name: req.body.location_province_name,
        },
        district: {
          id: req.body.location_district_id,
          name: req.body.location_district_name,
        },
        commune: {
          id: req.body.location_commune_id,
          name: req.body.location_commune_name,
        },
      },
      updatedAt: new Date().toLocaleDateString("vi-VN"),
    };
    const hotelUpdate = Hotel.findByIdAndUpdate(slug, formData, {
      new: true,
      lean: true,
    });
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      messages: "chỉnh sửa hotel thành công",
      hotel: hotelUpdate,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      messages: "lỗi khi chỉnh sửa hotel",
      code: StatusCodes.BAD_GATEWAY,
      error: error.message,
    });
  }
};
const updateStatusHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.body.id, {
      isActive: req.body.data.isActive,
    });
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      messages: "cập nhật trạng thái địa điểm tham quan thành công",
      hotel: hotel,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      messages: "lỗi khi cập nhật trạng thái địa điểm tham quan",
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
  createRoom,
  deleteHotel,
  searchResult,
  getHotelBooked,
  updateHotel,
  updateStatusHotel,
  updateRoom,
  deleteRoom,
};
