const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const createAttraction = async (req, res, next) => {
  const validations = Joi.object({
    name: Joi.string().min(1).max(100).trim(),
    description: Joi.string().required().max(1000).trim(),
    location: Joi.object().required(),
    city: Joi.string().required().min(3).max(100).trim(),
    isTrending: Joi.boolean().required(),
    difficulty: Joi.string().required().min(2).max(10),
    schedule: Joi.array().items(Joi.string().optional()),
    maxGroupSize: Joi.number().required().min(1).max(30),
    price: Joi.array().items(Joi.number()).required(),
    comments: Joi.array().items(Joi.object()),
    startDate: Joi.date().required(),
    guides: Joi.string(),
    duration: Joi.number().required(),
    included: Joi.array().items(Joi.string()),
    rating: Joi.number().required(),
    "city-slug": Joi.string(),
    cancelFree: Joi.boolean(),
  });
  try {
    await validations.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};
module.exports = {
  createAttraction,
};
