const { StatusCodes } = require("http-status-codes");
const Attraction = require("../models/Attraction");
const { mongooseArrays, mongoose } = require("../utils/mongoose");
export const convertToSlug = (text) => {
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  text = text.toLowerCase();
  text = text.replace(/[^a-z0-9\s-]/g, "");
  text = text.trim().replace(/\s+/g, "-");
  return text;
};
const getAttractions = async (req, res) => {
  const query = req.query;

  try {
    // get attractions admin with roles admin and partner
    if (query.roles && query.idCode) {
      let attractions = null;

      switch (query.roles) {
        case "admin": {
          attractions = await Attraction.find();
          break;
        }
        case "partner": {
          attractions = await Attraction.find({ unitCode: query.idCode });
          break;
        }
        default:
          return res.status(StatusCodes.BAD_REQUEST).json({
            messages: "Vai trò không hợp lệ",
            code: StatusCodes.BAD_REQUEST,
          });
      }

      if (attractions && attractions.length > 0) {
        return res.status(StatusCodes.OK).json({
          messages: "Lấy danh sách địa điểm tham quan du lịch thành công",
          data: mongooseArrays(attractions),
          code: StatusCodes.OK,
        });
      } else {
        return res.status(StatusCodes.OK).json({
          messages: "Không có địa điểm tham quan nào được tìm thấy",
          data: [],
          code: StatusCodes.OK,
        });
      }
    }

    const listQuery = {};
    const limit = parseInt(query.limit) || 10;
    if (query.trending === "true") {
      listQuery.isTrending = true;
    }
    const attractions = await Attraction.find(listQuery).limit(limit);

    if (attractions.length > 0) {
      return res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách địa điểm tham quan du lịch thành công",
        data: mongooseArrays(attractions),
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        messages: "Không có địa điểm tham quan nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: "Lỗi khi gọi lên server",
      code: StatusCodes.BAD_REQUEST,
    });
  }
};

const searchResult = async (req, res) => {
  try {
    const address = req.query.address;
    const attraction = await Attraction.find({
      "city-slug": address,
    });
    res.status(StatusCodes.OK).json({
      message:
        "Lấy danh sách địa điểm tham quan ở " +
        req.query.address +
        " thành công",
      data: mongooseArrays(attraction),
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
const getAttractionsDetail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const attraction = await Attraction.findOne({ slug }).exec();

    if (attraction) {
      res.status(StatusCodes.OK).json({
        message: "Lấy chi tiết địa điểm tham quan thành công",
        code: StatusCodes.OK,
        data: mongoose(attraction),
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy địa điểm tham quan này",
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
const getAttractionBooked = async (req, res) => {
  try {
    const arr = req.body.arr;
    const attractionsBooked = await Attraction.find({
      _id: { $in: arr },
    });
    // Send response
    if (attractionsBooked.length > 0) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách địa điểm tham quan đã đặt thành công",
        data: mongooseArrays(attractionsBooked),
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
const createAttraction = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      images: req.files.map((img) => img.path),
      createdAt: new Date().toLocaleDateString("vi-VN"),
      updatedAt: null,
      startDate: formatDateToDDMMYYYY(req.body.startDate),
      comments: [],
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
      numberOfTickets: {
        adult: req.body.numberOfTicketsAdult,
        children: req.body.numberOfTicketsChildren,
      },
      isActive: true,
    };
    const attraction = new Attraction(formData);
    await attraction.save();
    return res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      messages: "tạo mới  địa điểm du lịch thành công",
      attraction: attraction,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      messages: "lỗi khi tạo mới  địa điểm du lịch",
      error: error.message,
    });
  }
};
const updateAttraction = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      updatedAt: new Date().toLocaleDateString("vi-VN"),
      images: [...req.body.images, ...req.files.map((img) => img.path)],
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
    };
    const attraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      formData
    );
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      messages: "cập nhật địa điểm du lịch thành công",
      attraction: attraction,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      messages: "lỗi khi cập nhật địa điểm du lịch",
      error: error.message,
    });
  }
};
const updateStatusAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(
      req.body.id,
      req.body.data
    );
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      messages: "cập nhật trạng thái địa điểm du lịch thành công",
      attraction: attraction,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      messages: "lỗi khi cập nhật trạng thái địa điểm du lịch",
      error: error.message,
    });
  }
};
const deleteAttraction = async (req, res) => {
  const id = req.params.id;
  try {
    await Attraction.findOneAndDelete({ _id: id }).then(() => {
      res.status(StatusCodes.OK).json({
        message: "Xóa  địa điểm du lịch du lịch thành công",
        code: StatusCodes.OK,
      });
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Xóa địa điểm không thành công",
      code: StatusCodes.BAD_REQUEST,
      error: err.message,
    });
  }
};
module.exports = {
  getAttractions,
  getAttractionBooked,
  updateAttraction,
  updateStatusAttraction,
  deleteAttraction,
  createAttraction,
  getAttractionsDetail,
  searchResult,
};
