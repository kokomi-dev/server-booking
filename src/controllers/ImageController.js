const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../utils/cloundinary");

const delImageOnCloundinary = async (req, res) => {
  const { listImgDel } = req.body;
  try {
    const deletePromises = listImgDel.map(async (imgUrl) => {
      const res = await cloudinary.uploader.destroy(imgUrl);
      if (res.result !== "ok") {
        throw new Error(`Xóa ảnh không thành công: ${imgUrl}`);
      }
    });

    await Promise.all(deletePromises);
    return res.status(StatusCodes.OK).json({
      message: "Xóa thành công ảnh",
      code: StatusCodes.OK,
    });
  } catch (error) {
    return {
      message: error.message || "Có lỗi xảy ra khi xóa ảnh",
      code: StatusCodes.NOT_FOUND,
    };
  }
};
export { delImageOnCloundinary };
