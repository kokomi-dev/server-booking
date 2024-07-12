const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const createHotel = async (req, res) => {
  const validations = Joi.object({
    name: Joi.string().required().min(10).max(100).trim(),
    details: Joi.array().items.apply(Joi.string()).required(),
    location: Joi.string().required().min(5).max(256),
    price_one: Joi.number().required().min(4).max(12),
    images: Joi.array().items(Joi.string()).required(),
    city: Joi.string().min(3).required(),
    isFavorite: Joi.boolean().required().default(false),
    sales: Joi.number().required().default(0),
    rating: Joi.number().required().default(4.5),
  });
  try {
    await validations.validateAsync(req.body, { abortEarly: false });
    res.status(StatusCodes.OK).json({
      messages: "Createnew hotel success",
    });
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};
module.exports = {
  createHotel,
};
