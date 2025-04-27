const { StatusCodes } = require("http-status-codes");
const Attraction = require("~/models/Attraction");
const Hotel = require("~/models/Hotel");

const sendComment = async (req, res) => {
  try {
    const { data, category, idUser, nameUser, nameShow, slug } = req.body;
    let findItem = {};
    if (category === "attraction") {
      findItem = await Attraction.findOne({
        slug: slug,
      }).exec();
    }
    if (category === "hotel") {
      findItem = await Hotel.findOne({
        slug: slug,
      }).exec();
    }
    if (!findItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found item in comment",
      });
    }
    findItem.comments.unshift({
      idUser: idUser,
      name: nameUser,
      nameShow: nameShow,
      content: data.comment,
      ratingVote: data.vote,
      commentDate: new Date(),
    });
    if (findItem.comments.length > 0) {
      const ratingComment = findItem.comments.reduce(
        (accumentlator, currentValue) =>
          accumentlator + currentValue.ratingVote,
        0
      );
      findItem.rating = (
        (findItem.rating + ratingComment) /
        (findItem.comments.length + 1)
      ).toFixed(1);
    } else {
      findItem.rating = ((findItem.rating + data.vote) / 2).toFixed(1);
    }
    await findItem.save();
    res.status(StatusCodes.OK).json({
      message: "Comment success",
      data: {
        content: data.comment,
        ratingVote: data.vote,
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
const delelteComment = async (req, res) => {
  try {
    const { id, category, slug } = req.body;
    let findItem = {};
    if (category === "attraction") {
      findItem = await Attraction.findOne({
        slug: slug,
      }).exec();
    }
    if (category === "hotel") {
      findItem = await Hotel.findOne({
        slug: slug,
      }).exec();
    }
    if (!findItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found item delete",
      });
    }
    findItem.comments.forEach((cmt, index) => {
      if (cmt._id == id) {
        return findItem.comments.splice(index, 1);
      }
    });
    if (findItem.comments.length > 0) {
      const ratingComment = findItem.comments.reduce(
        (accumentlator, currentValue) =>
          accumentlator + currentValue.ratingVote,
        0
      );
      findItem.ratingsQuantity = (
        (findItem.ratingsQuantity + ratingComment) /
        (findItem.comments.length + 1)
      ).toFixed(1);
    }
    await findItem.save();
    res.status(StatusCodes.OK).json({
      message: "Delete comment success",
      code: StatusCodes.OK,
    });

    if (category === "hotels") {
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
const editComment = async (req, res) => {
  try {
    const { id, category, slug, content } = req.body;
    let findItem = {};
    if (category === "attraction") {
      findItem = await Attraction.findOne({
        slug: slug,
      }).exec();
    }
    if (category === "hotel") {
      findItem = await Hotel.findOne({
        slug: slug,
      }).exec();
    }
    if (!findItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found item delete",
      });
    }
    findItem.comments.forEach((cmt) => {
      if (cmt._id == id) {
        return (cmt.content = content);
      }
    });
    await findItem.save();
    res.status(StatusCodes.OK).json({
      message: "Cập nhật thành công",
      code: StatusCodes.OK,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
module.exports = {
  sendComment,
  delelteComment,
  editComment,
};
