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
    pickUpPoint,
    expectedTime,
    note,
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
    note,
    pickUpPoint,
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
    expectedTime,
    note,
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
    const bookedHotel = await BookedHotels.findByIdAndUpdate(
      { _id: id },
      data,
      {
        new: true,
      }
    );
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
  try {
    const { data } = req.body;
    const { id } = req.params;
    const bookedAttraction = await BookedAttractions.findByIdAndUpdate(
      { _id: id },
      data,
      {
        new: true,
      }
    );
    console.log(bookedAttraction);
    if (bookedAttraction) {
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật thành công",
        code: StatusCodes.OK,
        bookedAttractionUpdate: bookedAttraction,
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
const totalBookedAttractions = async (req, res) => {
  try {
    const { all, date, week, month } = req.body;
    let query = {};
    let result = {};
    const currentDate = new Date();

    // Get beginning of current day (midnight)
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Get beginning of current week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get end of current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Handle different filtering scenarios
    if (all === true) {
      // Get all data grouped by months
      const currentYear = currentDate.getFullYear();
      const allMonthsData = await BookedAttractions.aggregate([
        {
          $match: {
            bookedDate: {
              $gte: new Date(currentYear, 0, 1), // From January 1st of current year
            },
          },
        },
        {
          $group: {
            _id: { $month: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all months (including empty ones)
      const monthsArray = [];
      for (let i = 1; i <= 12; i++) {
        const monthData = allMonthsData.find((item) => item._id === i);
        monthsArray.push({
          month: i,
          totalRevenue: monthData ? monthData.totalRevenue : 0,
          count: monthData ? monthData.count : 0,
        });

        // Only include months up to current month
        if (i === currentDate.getMonth() + 1) break;
      }

      result = {
        success: true,
        data: monthsArray,
      };
    } else if (date === true) {
      // Get data for today only
      query = {
        bookedDate: {
          $gte: startOfDay,
          $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
        },
      };

      const todayData = await BookedAttractions.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
      ]);

      result = {
        success: true,
        data: {
          date: startOfDay,
          totalRevenue: todayData.length > 0 ? todayData[0].totalRevenue : 0,
          count: todayData.length > 0 ? todayData[0].count : 0,
        },
      };
    } else if (week === true) {
      // Get data for current week
      query = {
        bookedDate: { $gte: startOfWeek, $lte: endOfWeek },
      };

      const weekData = await BookedAttractions.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dayOfWeek: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all days of week (including empty ones)
      const weekArray = [];
      for (let i = 1; i <= 7; i++) {
        const dayData = weekData.find((item) => item._id === i);
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i - 1);

        weekArray.push({
          day: i,
          date: dayDate,
          totalRevenue: dayData ? dayData.totalRevenue : 0,
          count: dayData ? dayData.count : 0,
        });
      }

      result = {
        success: true,
        data: weekArray,
        startOfWeek,
        endOfWeek,
      };
    } else if (month.status === true) {
      // Get data for specific month
      const targetMonth = month.value
        ? parseInt(month.value) - 1
        : currentDate.getMonth();
      const targetYear = currentDate.getFullYear();

      const startOfMonth = new Date(targetYear, targetMonth, 1);
      const endOfMonth = new Date(
        targetYear,
        targetMonth + 1,
        0,
        23,
        59,
        59,
        999
      );

      query = {
        bookedDate: { $gte: startOfMonth, $lte: endOfMonth },
      };

      const monthData = await BookedAttractions.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dayOfMonth: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all days of month (including empty ones)
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthArray = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const dayData = monthData.find((item) => item._id === i);
        const dayDate = new Date(targetYear, targetMonth, i);

        monthArray.push({
          day: i,
          date: dayDate,
          totalRevenue: dayData ? dayData.totalRevenue : 0,
          count: dayData ? dayData.count : 0,
        });
      }

      result = {
        success: true,
        data: monthArray,
        month: targetMonth + 1,
        year: targetYear,
      };
    } else {
      // If no valid filter is provided
      result = {
        success: false,
        message:
          "Please provide a valid filter parameter (all, date, week, or month)",
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in totalBookedAttractions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const totalBookedHotel = async (req, res) => {
  try {
    const { all, date, week, month, monthValue } = req.body;
    let query = {};
    let result = {};

    const currentDate = new Date();

    // Get beginning of current day (midnight)
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Get beginning of current week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get end of current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Handle different filtering scenarios
    if (all === true) {
      // Get all data grouped by months
      const currentYear = currentDate.getFullYear();
      const allMonthsData = await BookedHotels.aggregate([
        {
          $match: {
            bookedDate: {
              $gte: new Date(currentYear, 0, 1), // From January 1st of current year
            },
          },
        },
        {
          $group: {
            _id: { $month: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all months (including empty ones)
      const monthsArray = [];
      for (let i = 1; i <= 12; i++) {
        const monthData = allMonthsData.find((item) => item._id === i);
        monthsArray.push({
          month: i,
          totalRevenue: monthData ? monthData.totalRevenue : 0,
          count: monthData ? monthData.count : 0,
        });

        // Only include months up to current month
        if (i === currentDate.getMonth() + 1) break;
      }

      result = {
        success: true,
        data: monthsArray,
      };
    } else if (date === true) {
      // Get data for today only
      query = {
        bookedDate: {
          $gte: startOfDay,
          $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
        },
      };

      const todayData = await BookedHotels.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
      ]);

      result = {
        success: true,
        data: {
          date: startOfDay,
          totalRevenue: todayData.length > 0 ? todayData[0].totalRevenue : 0,
          count: todayData.length > 0 ? todayData[0].count : 0,
        },
      };
    } else if (week === true) {
      // Get data for current week
      query = {
        bookedDate: { $gte: startOfWeek, $lte: endOfWeek },
      };

      const weekData = await BookedHotels.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dayOfWeek: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all days of week (including empty ones)
      const weekArray = [];
      for (let i = 1; i <= 7; i++) {
        const dayData = weekData.find((item) => item._id === i);
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i - 1);

        weekArray.push({
          day: i,
          date: dayDate,
          totalRevenue: dayData ? dayData.totalRevenue : 0,
          count: dayData ? dayData.count : 0,
        });
      }

      result = {
        success: true,
        data: weekArray,
        startOfWeek,
        endOfWeek,
      };
    } else if (month.status === true) {
      // Get data for specific month
      const targetMonth = month.value
        ? parseInt(month.value) - 1
        : currentDate.getMonth();
      const targetYear = currentDate.getFullYear();

      const startOfMonth = new Date(targetYear, targetMonth, 1);
      const endOfMonth = new Date(
        targetYear,
        targetMonth + 1,
        0,
        23,
        59,
        59,
        999
      );

      query = {
        bookedDate: { $gte: startOfMonth, $lte: endOfMonth },
      };

      const monthData = await BookedHotels.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dayOfMonth: "$bookedDate" },
            totalRevenue: { $sum: "$totalBooked" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Transform to array with all days of month (including empty ones)
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthArray = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const dayData = monthData.find((item) => item._id === i);
        const dayDate = new Date(targetYear, targetMonth, i);

        monthArray.push({
          day: i,
          date: dayDate,
          totalRevenue: dayData ? dayData.totalRevenue : 0,
          count: dayData ? dayData.count : 0,
        });
      }

      result = {
        success: true,
        data: monthArray,
        month: targetMonth + 1,
        year: targetYear,
      };
    } else {
      // If no valid filter is provided
      result = {
        success: false,
        message:
          "Please provide a valid filter parameter (all, date, week, or month)",
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in totalBookedHotels:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = {
  getBookedAttraction,
  getBookedHotel,
  createBooked,
  updateBookedAttraction,
  updateBookedHotel,
  getInfoBooked,
  totalBookedAttractions,
  totalBookedHotel,
};
