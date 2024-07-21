const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const createTours = async (req, res, next) => {
  const validations = Joi.object({
    name: Joi.string().required().min(10).max(100).trim(),
    description: Joi.string().required().min(50).max(1000).trim(),
    location: Joi.string().required().min(10).max(100).trim(),
    arena: Joi.string().required().min(5).max(100).trim(),
    city: Joi.string().required().min(3).max(100).trim(),
    isTrending: Joi.boolean().required(),
    difficulty: Joi.string().required().min(2).max(10),
    details: Joi.array().items(Joi.string()),
    maxGroupSize: Joi.number().required().min(1).max(20),
    price: Joi.number().required().min(100),
    images: Joi.array().items(Joi.string()).required(),
    comment: Joi.array().items(Joi.object()),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    guides: Joi.string(),
    hightlights: Joi.string(),
    included: Joi.array().items(Joi.string()),
    // ratingsAverage: Joi.number().required(),
    // ratingsQuantity: Joi.number().required(),
  });
  try {
    await validations.validateAsync(req.body, { abortEarly: false });
    res.status(StatusCodes.OK).json({
      messages: "Createnew tour success",
    });
    next();
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};
module.exports = {
  createTours,
};
