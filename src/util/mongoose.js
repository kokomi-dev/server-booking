module.exports = {
  // xử lí khi dữ liệu là một mảng
  mongooseArrays: (mongoose) => {
    return mongoose.map((mongoose) => mongoose.toObject());
  },
  // xư lí khi là dơn lẻ
  mongoose: (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
