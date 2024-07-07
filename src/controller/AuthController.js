const bcrypt = require("bcrypt");
const userModel = require("../model/User");
const jwt = require("jsonwebtoken");
const validatePasword = (password) => {
  return password.match(
    // Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  );
};
const register = async (request, response) => {
  try {
    let bodyRequest = request.body;
    if (request.file) {
      return response.status(400).json({
        status: "Error 400: Bad Request",
        message: "img is required",
      });
    }
    if (!bodyRequest.name) {
      return response.status(400).json({
        status: "Error 400: Bad Request",
        message: "name is required",
      });
    }
    if (!bodyRequest.email) {
      return response.status(400).json({
        status: "Error 400: Bad Request",
        message: "email is required",
      });
    }
    if (!bodyRequest.password) {
      return response.status(400).json({
        status: "Error 400: Bad Request",
        message: "password is required",
      });
    }
    if (!validatePasword(bodyRequest.password)) {
      return response.status(400).json({
        status: "Error 400: Bad Request",
        message: "password is not valid",
      });
    }
    const hasPass = await bcrypt.hash(bodyRequest.password, 10);
    const user = await userModel.create({
      ...bodyRequest,
      password: hasPass,
      img: request.file,
    });
    user.password = undefined;
    return response.status(200).json({
      message: "register account successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};
const login = async (request, response) => {
  try {
    let bodyRequest = request.body;
    const user = await userModel.findOne({ email: bodyRequest.email });
    if (user) {
      // đối cố thứ nhát là mật khẩu người dùng nhập , thứ 2 là mật khẩu của email được match  trong database user
      const validPassword = await bcrypt.compare(
        bodyRequest.password,
        user.password
      );
      if (validPassword) {
        const token = jwt.sign({ _id: user._id }, "kokomi_dev", {
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
const logout = async(request, response) => {
try{


}
catch{
  
}

};
module.exports = {
  register,
  login,
  logout,
};
