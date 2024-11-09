const env = require("./enviroment");
const WHILE_LIST = ["http://localhost:3000"];

export const corsOption = {
  origin: function (origin, callback) {
    // nếu đang là môi trường dev cho phép truy câp
    if (!origin && env.NODE_MODE === "dev") {
      return callback(null, true);
    }
    // kiểm tra xem có những domain nào được quyền kết nối đến
    if (WHILE_LIST.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Lỗi không có quyền truy cập domain này"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionSuccessStatus: 200,
  //   cho phép nhận cookie từ reqquest (access token, refresh token)
  credentials: true,
};
