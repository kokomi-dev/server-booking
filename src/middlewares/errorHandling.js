const { StatusCodes } = require("http-status-codes");
const { env } = require("~/config/enviroment");
const errorHandling = (error, req, res, next) => {
  if (!error) {
    return res.StatusCodes.INTERNAL_SERVER_ERROR.json({
      error: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
  const responseError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message,
    stack: error.stack,
  };
  // nếu ở trong mỗi trường dev thì sẽ có log lỗi cả stack còn ở production thì không có stack
  if (env.NODE_MODE !== "dev") {
    return delete responseError.stack;
  }
  res.status(responseError.statusCode).json(responseError);
};
module.exports = errorHandling;
