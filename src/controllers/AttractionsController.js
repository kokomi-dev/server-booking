const { StatusCodes } = require("http-status-codes");
const Attraction = require("../models/Attraction");
const { mongooseArrays, mongoose } = require("../utils/mongoose");

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
    const attraction = await Attraction.findOne({
      slug: slug,
    }).exec();
    res.status(StatusCodes.OK).json({
      messages: "Lấy chi tiết địa điểm du lịch du lịch thành công",
      data: mongoose(attraction),
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: "Lỗi khi lấy dữ liệu chi tiết địa điểm du lịch ",
      error: error,
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
      startDate: req.body.startDate.toLocaleDateString("vi-VN"),
    };
    const attraction = new Attraction(formData);
    await attraction.save();
    res.status(StatusCodes.CREATED).json({
      messages: "tạo mới  địa điểm du lịch thành công",
      attraction: attraction,
    });
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      messages: "lỗi khi tạo mới  địa điểm du lịch",
      error: error.message,
    });
  }
};
const updateAttraction = async (req, res, next) => {
  const img = req.files.map((img) => img.path);

  try {
    await Attraction.updateOne(
      { id: req.params.id },
      { ...req.body, images: img }
    );
    res.status(200).json({
      messages: "Cập nhật thành công  địa điểm du lịch du lịch",
    });
  } catch (error) {
    next(error);
  }
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
