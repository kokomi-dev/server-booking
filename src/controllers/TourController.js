const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const { mongooseArrays, mongoose } = require("../utils/mongoose");

const getTours = async (req, res, next) => {
  try {
    const listQuery = {};
    const query = req.query;
    // limit
    const limit = parseInt(query.limit) || 10;
    // trending
    if (query.trending === "true") {
      listQuery.isTrending = true;
    }
    // Find tours with the query and limit
    const tours = await Tour.find(listQuery).limit(limit);
    // Send response
    if (tours.length > 0) {
      res.status(StatusCodes.OK).json({
        messages: "Lấy danh sách tour du lịch thành công",
        data: mongooseArrays(tours),
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        messages: "Không có tour nào được tìm thấy",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};
const getTourDetail = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const tour = await Tour.findOne({
      slug: slug,
    }).exec();
    res.status(StatusCodes.OK).json({
      messages: "Lấy chi tiết tour du lịch thành công",
      data: mongoose(tour),
    });
  } catch (error) {
    next(error);
  }
};
const createTours = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      images: req.files.map((img) => img.path),
      createdAt: new Date().toLocaleDateString("vi-VN"),
      startDate: req.body.startDate.toLocaleDateString("vi-VN"),
    };
    const tour = new Tour(formData);
    await tour.save();
    res.status(StatusCodes.CREATED).json({
      messages: "tạo mới tour thành công",
      tour: tour,
    });
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      messages: "lỗi khi tạo mới tour",
      error: error.message,
    });
  }
};
const updateTours = async (req, res, next) => {
  const img = req.files.map((img) => img.path);

  try {
    await Tour.updateOne({ id: req.params.id }, { ...req.body, images: img });
    res.status(200).json({
      messages: "Cập nhật thành công tour du lịch",
    });
  } catch (error) {
    next(error);
  }
};
const deleteTour = async (req, res, next) => {
  try {
    await Tour.delete({ id: req.params.id })
      .then(() => {
        res.status(202).json({
          messages: "Xóa tour du lịch thành công",
        });
      })
      .catch(next);
  } catch {
    console.log("Có lỗi xảy ra khi xóa tour này");
  }
};
module.exports = {
  getTours,
  updateTours,
  deleteTour,
  createTours,
  getTourDetail,
};
