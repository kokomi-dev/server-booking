const { StatusCodes } = require("http-status-codes");
const BookedAttractions = require("../models/BookedAttractions");
const BookedHotel = require("../models/BookedHotels");

const getBookedAttraction = async () => {};
const getBookedHotel = async () => {};

const createBooked = async (req, res) => {
  const {
    amount,
    userId,
    tripId,
    img,
    numberTicketAdult,
    numberTicketChildren,
    unitCode,
    startDate,
    hour,
    category,
    paymentMethod,
  } = req.body;
  const bookedAtt = {
    slugBooked: tripId,
    idUser: userId,
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
};

module.exports = {
  getBookedAttraction,
  getBookedHotel,
  createBooked,
};
