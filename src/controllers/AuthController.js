const bcrypt = require("bcrypt");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const { StatusCodes } = require("http-status-codes");

const validatePasword = (password) => {
  return password.match(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
};
const register = async (request, response) => {
  try {
    let bodyRequest = request.body.data;

    // if (request.file) {
    //   return response.status(StatusCodes.PAYMENT_REQUIRED).json({
    //     status: "Error 400: Bad Request",
    //     message: "img is required",
    //   });
    // }
    if (!bodyRequest.firstname) {
      return response.status(StatusCodes.PAYMENT_REQUIRED).json({
        status: "Error 400: Bad Request",
        message: "firstname is required",
      });
    }
    if (!bodyRequest.lastname) {
      return response.status(StatusCodes.PAYMENT_REQUIRED).json({
        status: "Error 400: Bad Request",
        message: "lastname is required",
      });
    }
    if (!bodyRequest.email) {
      return response.status(StatusCodes.PAYMENT_REQUIRED).json({
        status: "Error 400: Bad Request",
        message: "email is required",
      });
    }
    if (!bodyRequest.numberPhone) {
      return response.status(StatusCodes.PAYMENT_REQUIRED).json({
        status: "Error 400: Bad Request",
        message: "numberphone is required",
      });
    }
    if (!bodyRequest.password) {
      return response.status(StatusCodes.PAYMENT_REQUIRED).json({
        status: "Error 400: Bad Request",
        message: "password is required",
      });
    }
    if (!validatePasword(bodyRequest.password)) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: "Error 400: Bad Request",
        message: "password is not valid",
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
      error: error,
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
        response
          .status(200)
          .json({ message: "login is successfully", token: token, user: user });
      } else {
        response.status(400).json({ error: "Password is valid!!!" });
      }
    } else {
      response.status(401).json({ error: "Email is valid!!!" });
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

module.exports = {
  register,
  login,
  getCurrentUser,
};
