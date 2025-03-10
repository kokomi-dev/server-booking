import { dateConvertToISO } from "~/utils/formatDate";

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
  const { roles, unitCode, isTrending } = req.query;
  try {
    const query = req.query;
    if (roles && unitCode) {
      let attractions = null;
      switch (roles) {
        case "admin": {
          attractions = await Attraction.find();
          break;
        }
        case "partner": {
          attractions = await Attraction.find({ unitCode: unitCode });
          break;
        }
        default:
          return res.status(StatusCodes.BAD_REQUEST).json({
            messages: "Vai trò không hợp lệ",
            code: StatusCodes.BAD_REQUEST,
          });
      }

      if (attractions.length > 0) {
        res.status(StatusCodes.OK).json({
          messages: "Lấy danh sách địa điểm địa điểm du lịch thành công",
          data: mongooseArrays(attractions),
          code: StatusCodes.OK,
        });
      } else {
        res.status(StatusCodes.OK).json({
          messages: "Không có địa điểm địa điểm du lịch nào được tìm thấy",
          data: [],
          code: StatusCodes.OK,
        });
      }
    } else {
      const listQuery = {
        isActive: true,
        startDate: { $gte: new Date() },
      };
      const limit = parseInt(query.limit) || 10;
      if (isTrending) {
        listQuery.isTrending = true;
      }
      const attraction = await Attraction.find(listQuery).limit(limit);

      if (attraction.length > 0) {
        res.status(StatusCodes.OK).json({
          messages: "Lấy danh sách địa điểm du lịch  thành công",
          data: mongooseArrays(attraction),
        });
      } else {
        res.status(StatusCodes.OK).json({
          messages: "Không có địa điểm nào được tìm thấy",
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
const getFilterAttractions = async (req, res) => {
  const query = req.query;
  try {
    let listQuery = {};
    const limit = parseInt(query.limit) || 10;
    let sortOption = {};

    if (query.roles && query.unitCode) {
      let attractions = null;
      if (query.roles === "admin") {
        attractions = await Attraction.find();
      } else if (query.roles === "partner") {
        attractions = await Attraction.find({ unitCode: query.unitCode });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          messages: "Vai trò không hợp lệ",
          code: StatusCodes.BAD_REQUEST,
        });
      }

      return res.status(StatusCodes.OK).json({
        messages:
          attractions.length > 0
            ? "Lấy danh sách địa điểm tham quan du lịch thành công"
            : "Không có địa điểm tham quan nào được tìm thấy",
        data: mongooseArrays(attractions),
        code: StatusCodes.OK,
      });
    }
    if (query.address !== "undefined" && query.address) {
      listQuery.city = query.address;
    }
    if (query.trending === "true") {
      listQuery.isTrending = true;
    }
    if (query.startDate) {
      listQuery.startDate = dateConvertToISO(query.startDate);
    }
    if (
      query.difficulty &&
      query.difficulty !== undefined &&
      !isNaN(query.difficulty)
    ) {
      listQuery.difficulty = Number(query.difficulty);
    }
    if (query.price && query.price !== "") {
      const priceRanges = {
        0: {},
        1: { $gte: 0, $lte: 400000 },
        2: { $gte: 400000, $lte: 1000000 },
        3: { $gte: 1000000, $lte: 3000000 },
        4: { $gte: 3000000, $lte: 5000000 },
        5: { $gte: 5000000, $lte: 1000000000 },
      };
      if (priceRanges[query.price])
        listQuery["price.0"] = priceRanges[query.price];
    }

    if (query.rating != 0) {
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
        sortOption["price.0"] = 1;
      }
      if (query.filterBar == 2) {
        sortOption["rating"] = 1;
      }
    } else {
      sortOption = { _id: 1 };
    }

    const attractions = await Attraction.find(listQuery).sort(sortOption);

    return res.status(StatusCodes.OK).json({
      messages:
        attractions.length > 0
          ? "Lấy danh sách địa điểm tham quan du lịch thành công"
          : "Không có địa điểm tham quan nào được tìm thấy",
      data: mongooseArrays(attractions),
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
      createdAt: new Date(),
      updatedAt: null,
      difficutly: Number(req.body.difficutly),
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
      updatedAt: new Date(),
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
  const { id, data, caseStatus, numberTicketAdult, numberTicketChildren } =
    req.body;
  try {
    if (caseStatus) {
      switch (caseStatus) {
        case "update-number-tickets":
          const attraction = await Attraction.findById(id);
          const updatedAttraction = await Attraction.findByIdAndUpdate(
            id,
            {
              $set: {
                "numberOfTickets.adult":
                  attraction.numberOfTickets.adult - numberTicketAdult,
                "numberOfTickets.children":
                  attraction.numberOfTickets.children - numberTicketChildren,
              },
            },
            { new: true }
          );
          break;
        default:
          break;
      }
    } else {
      const attraction = await Attraction.findByIdAndUpdate(id, data);
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        messages: "cập nhật trạng thái địa điểm du lịch thành công",
        attraction: attraction,
      });
    }
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
  getFilterAttractions,
};
