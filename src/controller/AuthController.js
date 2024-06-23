const Auth = require("../model/Auth");
// login
const login = (req, res, next) => {};
const resgister = (req, res, next) => {
  const { user__name, user__pass } = req.body;
  if (user__name === "admin" && user__pass === "123") {
    req.session.user = { user__name };
  }
};

module.exports = {
  login,
  resgister,
};
