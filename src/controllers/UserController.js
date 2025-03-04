const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const delUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const user = await User.findByIdAndDelete(id);
      if (user) {
        res.status(StatusCodes.OK).json({
          message: "Xóa thành công tài khoản",
          code: StatusCodes.OK,
        });
      } else
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không tìm thấy tài khoản",
          code: StatusCodes.BAD_REQUEST,
        });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      err: error.message,
      code: StatusCodes.BAD_REQUEST,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { count, category, id } = req.body;
    if (category === "attraction") {
      const user = await User.findById(id);
      if (user) {
        const currentAttractionCount = user.numberOfBooked?.attraction || 0;
        await User.findByIdAndUpdate(
          id,
          {
            $set: {
              "numberOfBooked.attraction": currentAttractionCount + count,
              "numberOfBooked.bookedDateLatest": new Date(),
            },
          },
          { new: true }
        );
        return res.status(StatusCodes.OK).json({
          message: "Cập nhật thành công số lượng địa điểm đặt của tài khoản",
          code: StatusCodes.OK,
          userUpdated: user,
        });
      }
    } else {
      const user = await User.findById(id);
      if (user) {
        const currentHotelCount = user.numberOfBooked?.hotel || 0;
        const userUpdate = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              "numberOfBooked.hotel": currentHotelCount + count,
              "numberOfBooked.bookedDateLatest": new Date(),
            },
          },
          { new: true }
        );
        return res.status(StatusCodes.OK).json({
          message: "Cập nhật thành công số lượng phòng đặt của tài khoản",
          code: StatusCodes.OK,
          userUpdated: userUpdate,
        });
      }
    }
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Không tìm thấy tài khoản",
      err: error.message,
      code: StatusCodes.FORBIDDEN,
    });
  }
};
module.exports = {
  delUser,
  updateUser,
};
