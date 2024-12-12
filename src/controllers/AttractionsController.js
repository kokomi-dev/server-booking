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
const getAttractions = async (req, res, next) => {
  try {
    const listQuery = {};
    const query = req.query;
    // limit
    const limit = parseInt(query.limit) || 10;
    // trending
    if (query.trending === "true") {
      listQuery.isTrending = true;
    }
    // Find attractions with the query and limit
    const attractions = await Attraction.find(listQuery).limit(limit);
    // Send response
    if (attractions.length > 0) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách địa điểm tham quan du lịch thành công",
        data: mongooseArrays(attractions),
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        messages: "Không có địa điểm tham quan nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    next(error);
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
      comments: [],
      location: {
        detail: req.body.location_detail,
        province_id: req.body.location_province_id,
        district_id: req.body.location_district_id,
        commune_id: req.body.location_commune_id,
      },
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
  console.log(req.body);
  // try {
  //   const formData = {
  //     ...req.body,
  //   };
  //   const attraction = await Attraction.findByIdAndUpdate(
  //     req.params.id,
  //     formData
  //   );
  //   return res.status(StatusCodes.OK).json({
  //     code: StatusCodes.CREATED,
  //     messages: "cập nhật địa điểm du lịch thành công",
  //     attraction: attraction,
  //   });
  // } catch (error) {
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     code: StatusCodes.BAD_REQUEST,
  //     messages: "lỗi khi cập nhật địa điểm du lịch",
  //     error: error.message,
  //   });
  // }
};
const deleteAttraction = async (req, res, next) => {
  try {
    await Attraction.delete({ id: req.params.id })
      .then(() => {
        res.status(202).json({
          messages: "Xóa  địa điểm du lịch du lịch thành công",
        });
      })
      .catch(next);
  } catch {
    console.log("Có lỗi xảy ra khi xóa  địa điểm du lịch này");
  }
};
module.exports = {
  getAttractions,
  getAttractionBooked,
  updateAttraction,
  deleteAttraction,
  createAttraction,
  getAttractionsDetail,
  searchResult,
};
