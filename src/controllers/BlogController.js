import { mongooseArrays } from "~/utils/mongoose";

const { StatusCodes } = require("http-status-codes");
const Blog = require("../models/Blog");

const getAllBlog = async (req, res) => {
  try {
    const { roles, unitCode, isDraft, isTrending } = req.query;
    if (roles === "admin") {
      const data = await Blog.find({
        isDraft: isDraft ?? false,
      });
      return res.status(StatusCodes.OK).json({
        message: "Lấy thành công danh sách bài viết",
        code: StatusCodes.OK,
        listBlogs: mongooseArrays(data),
      });
    }
    if (roles === "partner") {
      const data = await Blog.find({
        isDraft: isDraft ?? false,
        unitCode: unitCode,
      });
      return res.status(StatusCodes.OK).json({
        message: "Lấy thành công danh sách bài viết",
        code: StatusCodes.OK,
        listBlogs: mongooseArrays(data),
      });
    }
    let filter = { isDraft: false };

    if (isTrending === "true") {
      filter.isTrending = true;
    }
    if (unitCode) {
      filter.unitCode = unitCode;
    }

    const data = await Blog.find({
      ...filter,
      isDraft: false,
      isActive: true,
      isApprove: true,
    });
    return res.status(StatusCodes.OK).json({
      message: "Lấy thành công danh sách bài viết",
      code: StatusCodes.OK,
      listBlogs: mongooseArrays(data),
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lôi khi lấy dữ liệu",
      error: error,
    });
  }
};
const createBlog = async (req, res) => {
  try {
    const data = {
      ...req.body.data,
      createdAt: new Date(),
      updatedAt: null,
      like: 0,
      comments: [],
      isTrending: false,
      isActive: false,
      isApprove: false,
    };
    const blog = new Blog(data);
    await blog.save();
    return res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      messages: "Tạo mới bài viết thành công",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      messages: "Tạo mới bài viết không thành công",
    });
  }
};
const getDetailBlog = async (req, res) => {
  try {
    const slug = req.params.slug;
    if (slug) {
      const blog = await Blog.findOne({ slug }).exec();
      if (blog) {
        return res.status(StatusCodes.OK).json({
          message: "Tìm thấy bài viết",
          code: StatusCodes.OK,
          detailBlog: blog,
        });
      }
      return res.status(StatusCodes.OK).json({
        message: "Không tìm thấy bài viết",
        code: StatusCodes.NOT_FOUND,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error,
    });
  }
};

const editBlog = async (req, res) => {
  const { data } = req.body;
  try {
    const dataUpdate = {
      ...data,
      updatedAt: new Date(),
    };
    const blog = await Blog.findByIdAndUpdate(req.params.id, dataUpdate);
    if (blog) {
      return res.status(StatusCodes.OK).json({
        message: "Chỉnh sửa thành công",
        blogUpdated: blog,
        code: StatusCodes.OK,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Chỉnh sửa không thành công",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
const delBlog = async (req, res) => {
  try {
    const arrDel = req.body;
    if (!Array.isArray(arrDel)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Dữ liệu không hợp lệ, phải là một mảng ID." });
    }
    const delResult = await Blog.deleteMany({ _id: { $in: arrDel } });
    return res.status(StatusCodes.OK).json({
      message: `Đã xóa thành công ${delResult.deletedCount} blog.`,
      result: delResult,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi từ server",
    });
  }
};
// LIKE BLOG
const updateLikeBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1 },
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (blog) {
      return res.status(StatusCodes.OK).json({
        message: "Cập nhật thành công ",
        blogUpdated: blog,
        code: StatusCodes.OK,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Cập nhật không thành công",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
// COMMENTS BLOG
const postCommentBlog = async (req, res) => {
  const idBlog = req.params.id;
  const { email, roles, id, name, content, nameShow } = req.body.data;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      idBlog,
      {
        $push: {
          comments: {
            idUser: id,
            name,
            nameShow,
            email,
            roles,
            content,
            commentDate: new Date(),
          },
        },
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Bài viết không tồn tại",
        code: StatusCodes.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Bình luận thành công",
      comment: req.body.data,
      code: StatusCodes.OK,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Bình luận không thành công",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      err: error.message,
    });
  }
};

export {
  getAllBlog,
  createBlog,
  editBlog,
  delBlog,
  getDetailBlog,
  updateLikeBlog,
  postCommentBlog,
};
