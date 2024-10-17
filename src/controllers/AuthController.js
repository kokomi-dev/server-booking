const bcrypt = require("bcrypt");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const { StatusCodes } = require("http-status-codes");
const { trusted } = require("mongoose");

const validatePasword = (password) => {
  return password.match(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
};
const register = async (request, response) => {
  try {
    let bodyRequest = request.body.data;

    // if (request.file) {
    //   return response.status(StatusCodes.UNAUTHORIZED).json({
    //     status: "Error 400: Bad Request",
    //     message: "img is required",
    //   });
    // }
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
    if (!validatePasword(bodyRequest.password)) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Error 400: Bad Request",
        message: "password is not valid",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
    const hasPass = await bcrypt.hash(bodyRequest.password, 10);
    const user = await userModel.create({
      ...bodyRequest,
      password: hasPass,
      // img: request.file,
    });
    user.password = undefined;
    return response.status(StatusCodes.OK).json({
      message: "register account successfully",
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
    let bodyRequest = request.body.data;
    const user = await userModel.findOne({ email: bodyRequest.email });
    if (user) {
      // đối cố thứ nhát là mật khẩu người dùng nhập , thứ 2 là mật khẩu của email được match  trong database user
      const validPassword = await bcrypt.compare(
        bodyRequest.password,
        user.password
      );
      if (validPassword) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY_JWT, {
          expiresIn: "100d",
        });
        user.password = undefined;
        response.cookie("token_jwt", token, {
          httpOnly: true,
          sameSite: "strict",
        });
        response
          .status(200)
          .json({ message: "login is successfully", token: token, user: user });
      } else {
        response.status(400).json({
          message: "Email hoặc mật khẩu chưa chính xác !",
          code: StatusCodes.UNAUTHORIZED,
        });
      }
    } else {
      response.status(400).json({
        message: "Email hoặc mật khẩu chưa chính xác !",
        code: StatusCodes.UNAUTHORIZED,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authorization header thiếu hoặc không đúng định dạng",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY_JWT);
    const userData = await userModel.findOne({ _id: user._id });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thông tin người dùng thành công",
      user: userData,
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
      if (reqData.password === findUser.password) {
        if (reqData.passwordNew === reqData.passwordNewConfirm) {
          const hasPass = await bcrypt.hash(reqData.password, 10);
          const userUpdate = await userModel.findByIdAndUpdate(
            idUpdate,
            {
              $set: {
                ...reqData,
                email: findUser.email,
                password: hasPass,
                updated: new Date(),
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
      return res.status(StatusCodes.BAD_REQUEST).send("User not found");
    }
    // res.status(StatusCodes.OK).json(user);
  } catch (error) {}
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
module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  logout,
};
