const Tour = require("../model/Tour");
const { v4: uuidv4 } = require("uuid");
const { mongooseArrays } = require("../util/mongoose");

const getTours = async (req, res, next) => {
  try {
    Tour.find({}).then((tour) => {
      if (tour) {
        return res.status(200).json({
          messages: "Lấy danh sách tour du lịch thành công",
          data: mongooseArrays(tour),
        });
      }
    });
  } catch (error) {
    console.log("Xảy ra lỗi khi lấy danh sách tour", error);
  }
};
const createTours = async (req, res, next) => {
  try {
    const img = req.files.map((img) => img.path);
    const formData = req.body;
    formData.id = await uuidv4();
    formData.images = img;
    formData.createdAt = new Date().toLocaleDateString("vi-VN");
    // new Tour
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
const getToursWithCondition = async () => {
  try {
    const conditon = req.params;
    console.log(conditon);
    switch (conditon) {
      case "trending": {
        Tour.find({
          isTrending: true,
        }).then((tour) => {
          if (tour) {
            return res.status(200).json({
              messages: "Lấy danh sách tour du lịch nổi bật thành công",
              data: mongooseArrays(tour),
            });
          }
        });
      }
      default:
        Tour.find({}).then((tour) => {
          if (tour) {
            return res.status(200).json({
              messages: "Lấy danh sách tour du lịch thành công",
              data: mongooseArrays(tour),
            });
          }
        });
    }
  } catch {}
};
module.exports = {
  getTours,
  updateTours,
  deleteTour,
  createTours,
  getToursWithCondition,
};
