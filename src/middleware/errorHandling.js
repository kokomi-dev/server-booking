const statusCode = {
  Error: 500,
};
const errorHandling = (error, req, res, next) => {
  if (!error) {
    return res.statusCode.Error.json("No error handle");
  }
  const responseError = {
    statusCode: statusCode.Error,
    message: error.message,
    stack: error.stack,
  };
  res.status(responseError.statusCode).json(responseError);
};
module.exports = errorHandling;
