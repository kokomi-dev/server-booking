const { StatusCodes } = require("http-status-codes");
const BookedAttractions = require("../models/BookedAttractions");
const BookedHotels = require("../models/BookedHotels");
const { mongooseArrays } = require("~/utils/mongoose");

const getBookedAttraction = async (req, res) => {
  const { roles, unitCode } = req.query;
  if (roles === "admin" && !!unitCode) {
    const data = await BookedAttractions.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  } else {
    const data = await BookedAttractions.find({
      unitCode,
    });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công địa điểm tham quan đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  }
};
const getBookedHotel = async (req, res) => {
  const { roles, unitCode } = req.query;
  if (roles === "admin" && !!unitCode) {
    const data = await BookedHotels.find();
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công lưu trú đã đặt",
      code: StatusCodes.OK,
      data: mongooseArrays(data),
    });
  } else {
    const data = await BookedHotels.find({ unitCode });
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
    return res.status(StatusCodes.OK).json({
      message: "Đặt thành công địa điểm du lịch",
      code: StatusCodes.OK,
      bookedAttractions: bookedAttractions,
    });
  }
  if (category === "hotel") {
    const newBookedHotel = new BookedHotels(bookedHotel);
    await newBookedHotel.save();
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
