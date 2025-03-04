const { StatusCodes } = require("http-status-codes");
const BookedAttractions = require("../models/BookedAttractions");
const BookedHotels = require("../models/BookedHotels");
const { mongooseArrays } = require("~/utils/mongoose");
const { default: axios } = require("axios");

const getBookedAttraction = async (req, res) => {
  const { roles, unitCode, id } = req.query;
  if (roles === "admin" && !!unitCode) {
    const data = await BookedAttractions.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
  if (unitCode && roles === "partner") {
    const data = await BookedAttractions.find({
      unitCode,
    });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
  if (id) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = await BookedAttractions.find({
      "infoUser.idUser": id,
    }).sort({
      dateStart: 1,
    });
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.dateStart);
      const dateB = new Date(b.dateStart);
      if (dateA < today && dateB >= today) return 1;
      if (dateA >= today && dateB < today) return -1;
      return 0;
    });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(sortedData),
    });
  }
};
const getBookedHotel = async (req, res) => {
  const { roles, unitCode, id } = req.query;
  if (roles === "admin" && !!unitCode) {
    const data = await BookedHotels.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công lưu trú đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
  if (unitCode && roles === "partner") {
    const data = await BookedHotels.find({ unitCode });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công lưu trú đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
  if (id) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = await BookedHotels.find({
      "infoUser.idUser": id,
    }).sort({
      dateFrom: 1,
    });
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.dateFrom);
      const dateB = new Date(b.dateFrom);
      if (dateA < today && dateB >= today) return 1;
      if (dateA >= today && dateB < today) return -1;
      return 0;
    });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm lưu trú đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(sortedData),
    });
  }
};

const createBooked = async (req, res) => {
  const {
    amount,
    infoUser,
    tripId,
    img,
    numberTicketAdult,
    numberTicketChildren,
    unitCode,
    startDate,
    hour,
    category,
    paymentMethod,
    infoAttraction,
    infoHotel,
    infoHotelRoom,
    isSuccess,
  } = req.body;
  const bookedAtt = {
    slugBooked: tripId,
    infoUser,
    infoAttraction,
    unitCode: unitCode,
    paymentMethod,
    paymentUrl: "",
    totalBooked: Number(amount),
    numberOfTicketsBooked: {
      adult: Number(numberTicketAdult),
      children: Number(numberTicketChildren),
    },
    hourStart: hour,
    dateStart: startDate,
    img,
    bookedDate: new Date(),
    isSuccess,
  };
  const bookedHotel = {
    slugBooked: tripId,
    infoUser,
    infoAttraction,
    unitCode: unitCode,
    paymentMethod,
    paymentUrl: "",
    totalBooked: Number(amount),
    numberOfTicketsBooked: {
      adult: Number(numberTicketAdult),
      children: Number(numberTicketChildren),
    },
    infoHotel,
    infoHotelRoom,
    img,
    bookedDate: new Date(),
    isSuccess,
  };
  if (category === "attraction") {
    const bookedAttractions = new BookedAttractions(bookedAtt);

    await bookedAttractions.save();
    await axios.post(`${process.env.LOCAL_HOST_PORT}/api/user/update`, {
      id: infoUser.idUser,
      count: Number(numberTicketAdult) + Number(numberTicketChildren),
      category: "attraction",
    });

    return res.status(StatusCodes.OK).json({
      message: "Đặt thành công địa điểm du lịch",
      code: StatusCodes.OK,
      bookedAttractions: bookedAttractions,
    });
  }
  if (category === "hotel") {
    const newBookedHotel = new BookedHotels(bookedHotel);
    await newBookedHotel.save();
    await axios.post(`${process.env.LOCAL_HOST_PORT}/api/user/update`, {
      id: infoUser.idUser,
      count: infoHotelRoom.length,
      category: "hotel",
    });
    return res.status(StatusCodes.OK).json({
      message: "Đặt thành công noi lưu trú",
      code: StatusCodes.OK,
      bookedHotel: newBookedHotel,
    });
  }
};

const getInfoBooked = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    if (!category || !id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Thiếu dữ liệu",
      });
    } else {
      if (category === "attraction") {
        const reponse = await BookedAttractions.findOne({
          paymentUrl: id,
        });
        return res.status(StatusCodes.OK).json({
          message: "Lấy dữ liệu thành công",
          code: StatusCodes.OK,
          data: reponse,
        });
      } else {
        const reponse = await BookedHotels.findOne({
          paymentUrl: id,
        });
        return res.status(StatusCodes.OK).json({
          message: "Lấy dữ liệu thành công",
          code: StatusCodes.OK,
          data: reponse,
        });
      }
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi trên server",
      code: StatusCodes.BAD_REQUEST,
      err: error.message,
    });
  }
};
const updateBookedHotel = async (req, res) => {
  try {
    const { data } = req.body;
    const { id } = req.params;
    console.log(data, id);
    const bookedHotel = BookedHotels.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (bookedHotel) {
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật thành công",
        code: StatusCodes.OK,
        bookedHotelUpdate: bookedHotel,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Cập nhật không thành công",
      code: StatusCodes.BAD_REQUEST,
      err: error.message,
    });
  }
};
const updateBookedAttraction = async (req, res) => {
  console.log(req);
};
module.exports = {
  getBookedAttraction,
  getBookedHotel,
  createBooked,
  updateBookedAttraction,
  updateBookedHotel,
  getInfoBooked,
};
