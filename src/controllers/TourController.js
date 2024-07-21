const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
const { mongooseArrays } = require("../utils/mongoose");

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

const createTours = async (req, res, next) => {
  try {
    const img = req.files.map((img) => img.path);
    const formData = req.body;
    formData.images = img;
    formData.createdAt = new Date().toLocaleDateString("vi-VN");
    const tour = new Tour(formData);
    tour
      .save()
      .then(() => {
        res.status(200).json({
          messages: " tạo mới tour thành công",
          tour: tour,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(400).json({
      messages: " lỗi khi tạo mới tour",
      error: error,
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
};
