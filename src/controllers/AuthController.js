const bcrypt = require("bcrypt");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const { StatusCodes } = require("http-status-codes");
const { mongooseArrays } = require("~/utils/mongoose");
const { v4: uuidv4 } = require("uuid");

function checkGroupId(groupId) {
  if (groupId.includes("1") && groupId.includes("2") && groupId.includes("6")) {
    return true;
  }
  if (
    groupId.includes("2") &&
    groupId.includes("6") &&
    !groupId.includes("1")
  ) {
    return false;
  }
  if (groupId.includes("6") && groupId.length === 1) {
    return true;
  }
  return null;
}

const validatePasword = (password) => {
  return password.match(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
};
const getAllUser = async (req, res) => {
  const query = req.query;
  try {
    if (query.roles === "admin" || query.groupId === "1,2,6") {
      // get tài khoản doanh nghiệp
      if (query.key === "partner") {
        const userData = await userModel.find({
          roles: "partner",
        });
        return res.status(StatusCodes.OK).json({
          message: "Lấy tất cả đơn vị doanh nghiệp thành công",
          code: StatusCodes.OK,
          data: mongooseArrays(userData),
        });
      }
      // get tài khoản người dùng
      if (query.key === "custommer") {
        const userData = await userModel.find({
          roles: "custommer",
        });
        return res.status(StatusCodes.OK).json({
          message: "Lấy tất cả người dùng thành công",
          code: StatusCodes.OK,
          data: mongooseArrays(userData),
        });
      }
    } else if (query.key === "") {
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Bạn không có quyền sử dụng enpoind này",
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message,
      error: error,
    });
  }
};
const register = async (request, response) => {
  try {
    let bodyRequest = request.body;
    const reqRoles = bodyRequest.roles;
    if (!bodyRequest.email) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        status: "Error 400: Bad Request",
        message: "email is required",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    if (!bodyRequest.numberPhone) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        status: "Error 400: Bad Request",
        message: "numberphone is required",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    if (!bodyRequest.password) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        status: "Error 400: Bad Request",
        message: "password is required",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    if (!bodyRequest.firstname) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        status: "Error 400: Bad Request",
        message: "firstname is required",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    if (!bodyRequest.lastname) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        status: "Error 400: Bad Request",
        message: "lastname is required",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    if (!validatePasword(bodyRequest.password)) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Error 400: Bad Request",
        message: "Mật khẩu không đủ yêu cầu cho phép!",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    const hasPass = await bcrypt.hash(bodyRequest.password, 10);
    const user = await userModel.create({
      ...bodyRequest,
      password: hasPass,
      isActive: await checkGroupId(bodyRequest.groupId),
      isUnitActive: reqRoles === "custommer" ? null : false,
      isNewbie: true,
      roles: reqRoles,
      idCode: reqRoles === "custommer" ? "" : uuidv4().slice(0, 6),
      groupId: bodyRequest.groupId,
    });
    user.password = undefined;
    return response.status(StatusCodes.OK).json({
      message: "Đăng kí thành công tài khoản",
      user: user,
    });
  } catch (error) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
      code: StatusCodes.UNAUTHORIZED,
    });
  }
};
const login = async (request, response) => {
  try {
    const bodyRequest = request.body;
    const user = await userModel.findOne({ email: bodyRequest.email });

    if (user) {
      const validPassword = await bcrypt.compare(
        bodyRequest.password,
        user.password
      );
      if (validPassword) {
        if (user.isUnitActive === false && user.roles === "partner") {
          return response.status(StatusCodes.OK).json({
            message: "Tài khoản chưa được cấp phép",
            userEmail: user.email,
            code: StatusCodes.FORBIDDEN,
          });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, {
          expiresIn: "5m",
        });
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.SECRET_KEY_JWT_REFRESHTOKEN,
          {
            expiresIn: "15d",
          }
        );
        user.refreshToken = refreshToken;
        await user.save();
        user.password = undefined;

        response.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 15 * 24 * 60 * 60 * 1000,
        });

        response.status(StatusCodes.OK).json({
          message: "Đăng nhập thành công",
          accessToken: token,
          refreshToken: refreshToken,
          user: user,
          code: StatusCodes.OK,
        });
      } else {
        response.status(StatusCodes.NOT_FOUND).json({
          message: "Email hoặc mật khẩu người dùng chưa chính xác !",
          code: StatusCodes.NOT_FOUND,
        });
      }
    } else {
      response.status(StatusCodes.NOT_FOUND).json({
        message: "Email hoặc mật khẩu chưa chính xác !",
        code: StatusCodes.NOT_FOUND,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Không có id người dùng được gửi lên",
    });
  }
  try {
    const userData = await userModel.findOne({ _id: userId });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thông tin thành công",
      user: userData,
      code: StatusCodes.OK,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const reqData = req.body.data;
    const idUpdate = req.body.id;
    const findUser = await userModel.findOne({ _id: idUpdate });
    if (findUser) {
      if (reqData?.password === findUser.password) {
        if (reqData?.passwordNew === reqData?.passwordNewConfirm) {
          const hasPass = await bcrypt.hash(reqData.password, 10);
          const userUpdate = await userModel.findByIdAndUpdate(
            idUpdate,
            {
              $set: {
                ...reqData,
                email: findUser.email,
                password: hasPass,
                updated: new Date().toLocaleDateString("vi-VN"),
              },
            },
            { new: true }
          );
          if (userUpdate) {
            res.status(StatusCodes.ACCEPTED).json(userUpdate);
          } else {
            res
              .status(StatusCodes.NON_AUTHORITATIVE_INFORMATION)
              .json("Thông tin mật khẩu không đúng");
          }
        } else {
          res
            .status(StatusCodes.CONFLICT)
            .json("Mật khẩu mới không trùng khớp");
        }
      } else {
        const userUpdate = await userModel.findByIdAndUpdate(
          idUpdate,
          {
            $set: {
              ...reqData,
              email: findUser.email,
              updated: new Date(),
            },
          },
          { new: true }
        );
        if (userUpdate) {
          res.status(StatusCodes.OK).json({
            message: " Cập nhập tên người dùng thành công",
            userUpdated: userUpdate,
          });
        } else {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Lỗi khi đổi tên người dùng",
          });
        }
      }
    }
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Không tìm thấy tài khoản",
        code: StatusCodes.FORBIDDEN,
      });
    }
  } catch (error) {}
};
const updateStatus = async (req, res) => {
  try {
    const reqData = req.body.data;
    const idUpdate = req.body.id;
    const user = await userModel.findByIdAndUpdate(idUpdate, reqData);
    if (user) {
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật thành công trạng thái",
        code: StatusCodes.OK,
        userUpdated: user,
      });
    }
    return res.status(200).json(req.body.data);
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Không tìm thấy tài khoản",
      code: StatusCodes.FORBIDDEN,
    });
  }
};
const logout = async (req, res) => {
  try {
    // res.clearCookie("token_jwt");
    res.status(StatusCodes.OK).json({
      code: 200,
      message: "Đăng xuất người dùng thành công",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi khi dăng xuât",
      error: error,
    });
  }
};
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Refresh Token is required!" });
  }
  // Xác minh refreshToken
  jwt.verify(
    refreshToken,
    process.env.SECRET_KEY_JWT_REFRESHTOKEN,
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Xảy ra lỗi khi refreshToken!" });
      }
      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.SECRET_KEY_JWT_REFRESHTOKEN,
        { expiresIn: "3h" }
      );
      res.json({
        accessToken,
      });
    }
  );
};
module.exports = {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updateStatus,
  updateUser,
  logout,
  getAllUser,
};
