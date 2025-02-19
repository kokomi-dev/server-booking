const { StatusCodes } = require("http-status-codes");
const BookedAttractions = require("../models/BookedAttractions");
const { mongooseArrays } = require("~/utils/mongoose");
const BookedHotels = require("../models/BookedHotels");

const getBookedAttraction = async (req, res) => {
  const { roles, unitCode } = req.query;
  if (roles === "admin") {
    const data = await BookedAttractions.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
};
const getBookedHotel = async (req, res) => {
  const { roles, unitCode } = req.query;
  if (roles === "admin") {
    const data = await BookedHotels.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công lưu trú đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
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
    res.status(StatusCodes.OK).json({
      message: "Đặt thành công địa điểm du lịch",
      code: StatusCodes.OK,
      bookedAttractions: bookedAttractions,
    });
  }
  if (category === "hotel") {
    const newBookedHotel = new BookedHotels(bookedHotel);
    await newBookedHotel.save();
    res.status(StatusCodes.OK).json({
      message: "Đặt thành công địa điểm du lịch",
      code: StatusCodes.OK,
      bookedHotel: newBookedHotel,
    });
  }
};

module.exports = {
  getBookedAttraction,
  getBookedHotel,
  createBooked,
};
