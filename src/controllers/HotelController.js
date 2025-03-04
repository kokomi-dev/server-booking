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
      const listQuery = {
        isActive: true,
      };
      const limit = parseInt(query.limit) || 10;
      if (query.fillter === "favorite") {
        listQuery.isFavorite = true;
      }
      const hotel = await Hotel.find(listQuery).limit(limit);
      if (hotel.length > 0) {
        res.status(StatusCodes.OK).json({
          messages: "Lấy danh sách lưu trú  thành công",
          data: mongooseArrays(hotel),
        });
      } else {
        res.status(StatusCodes.OK).json({
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
      createdAt: new Date(),
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
        $set: { updatedAt: new Date() },
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
      updatedAt: new Date(),
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
  const { id, data, caseStatus, infoHotelRoom } = req.body;
  try {
    if (caseStatus) {
      switch (caseStatus) {
        case "update-number-room-booked":
          const hotel = await Hotel.findById(id);
          if (!hotel) {
            throw new Error("Không tìm thấy khách sạn");
          }
          for (const room of infoHotelRoom) {
            const roomId = room.id;
            const hotelRoom = hotel.listRooms.find(
              (r) => r._id.toString() === roomId
            );
            if (hotelRoom) {
              return await Hotel.updateOne(
                { _id: id, "listRooms._id": roomId },
                {
                  $set: {
                    "listRooms.$.numberOfRoom":
                      hotelRoom.numberOfRoom - room.numberBooked,
                    "listRooms.$.numberOfRoomBooked":
                      hotelRoom.numberOfRoomBooked ?? 0 + room.numberBooked,
                  },
                }
              );
            }
          }
          break;
        default:
          break;
      }
    } else {
      const hotel = await Hotel.findByIdAndUpdate(id, data);
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        messages: "cập nhật nơi lưu trú thành công",
        hotel: hotel,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      messages: "lỗi khi cập nhật nơi lưu trú",
      error: error.message,
    });
  }
};
const getFilterHotel = async (req, res) => {
  const query = req.query;
  try {
    let listQuery = {};
    const limit = parseInt(query.limit) || 10;
    let sortOption = {};

    if (query.roles && query.idCode) {
      let hotels = null;
      if (query.roles === "admin") {
        hotels = await Hotel.find();
      } else if (query.roles === "partner") {
        hotels = await Hotel.find({ unitCode: query.idCode });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          messages: "Vai trò không hợp lệ",
          code: StatusCodes.BAD_REQUEST,
        });
      }
      return res.status(StatusCodes.OK).json({
        messages:
          hotels.length > 0
            ? "Lấy danh sách nơi lưu trú thành công"
            : "Không có nơi lưu trú nào được tìm thấy",
        data: mongooseArrays(hotels),
        code: StatusCodes.OK,
      });
    }
    if (query.address !== "undefined" && query.address) {
      listQuery.city = query.address;
    }
    if (query.cancelFree === "1") {
      listQuery.cancelFree = true;
    }
    if (query.isFavorite == "1") {
      listQuery.isFavorite = true;
    }

    if (query.price && query.price !== "") {
      const priceRanges = {
        1: { $gte: 0, $lte: 400000 },
        2: { $gte: 400000, $lte: 1000000 },
        3: { $gte: 1000000, $lte: 3000000 },
        4: { $gte: 3000000, $lte: 5000000 },
        5: { $gte: 5000000, $lte: 1000000000 },
      };
      if (priceRanges[query.price])
        listQuery["listRooms.0.price"] = priceRanges[query.price];
    }

    if (query.rating) {
      const ratingRanges = {
        1: { $gte: 4.5, $lte: 5 },
        2: { $gte: 4, $lte: 5 },
        3: { $gte: 3.5, $lte: 5 },
        4: { $gte: 3, $lte: 5 },
      };
      if (ratingRanges[query.rating])
        listQuery.rating = ratingRanges[query.rating];
    }
    if (query.filterBar) {
      if (query.filterBar == 1) {
        sortOption["listRooms.0.price"] = 1;
      }
      if (query.filterBar == 2) {
        sortOption["rating"] = 1;
      }
    } else {
      sortOption = { _id: 1 };
    }
    const hotels = await Hotel.find({ ...listQuery }).sort(sortOption);

    return res.status(StatusCodes.OK).json({
      messages:
        hotels.length > 0
          ? "Lấy danh sách nơi lưu trú thành công"
          : "Không có nơi lưu trú nào được tìm thấy",
      data: mongooseArrays(hotels),
      code: StatusCodes.OK,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      messages: "Lỗi khi gọi lên server",
      error: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  getHotel,
  getDetail,
  createHotel,
  createRoom,
  deleteHotel,
  getFilterHotel,
  updateHotel,
  updateStatusHotel,
  updateRoom,
  deleteRoom,
};
