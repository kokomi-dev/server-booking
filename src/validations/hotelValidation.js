const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const createHotel = async (req, res, next) => {
  const validations = Joi.object({
    name: Joi.string().required().min(5).max(100).trim(),
    cancelFree: Joi.string().required(),
    comments: Joi.string(),
    details: Joi.string().required(),
    location_detail: Joi.string().required().min(5).max(256),
    location_province_id: Joi.string().required().min(5).max(256),
    location_district_id: Joi.string().required().min(5).max(256),
    location_commune_id: Joi.string().required().min(5).max(256),
    images: Joi.array().items(Joi.string()).required(),
    includes: Joi.array().require(),
    highlights: Joi.array().require(),
    type: Joi.string().required(),
    city: Joi.string().min(3).required(),
    rating: Joi.number().required().default(4.5),
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
  createHotel,
};
