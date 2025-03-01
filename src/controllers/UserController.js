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
module.exports = {
  delUser,
};
