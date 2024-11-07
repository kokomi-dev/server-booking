const axios = require("axios").default;
const qs = require("qs");
const CryptoJS = require("crypto-js");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");
const User = require("~/models/User");
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const sendRequestPay = async (req, res) => {
  const { amount, userId, tripId, category, img } = req.body;
  const embed_data = {
    redirecturl: "http://localhost:3000/attractions",
  };
  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `KokoTravel - Payment for the order #${transID}`,
    bank_code: "",

    userId: userId,
  };

  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    if (result && result.data) {
      const user = await User.findById(userId);
      if (category === "attraction") {
        user.bookedAttractions = [
          {
            tripId: tripId,
            orderId: order.app_trans_id,
            bookingDate: new Date(),
            amount,
          },
          ...user.bookedAttractions,
        ];
        user.notifys = [
          {
            title: "Đặt vé tham quan thành công",
            time: new Date(),
            img,
          },
          ...user.notifys,
        ];
        await user.save();
      }
      if (category === "hotel") {
        user.bookedHotels = [
          {
            tripId: tripId,
            orderId: order.app_trans_id,
            bookingDate: new Date(),
            amount,
          },
          ...user.bookedHotels,
        ];
        user.notifys = [
          {
            title: "Đặt nơi lưu trú thành công",
            time: new Date(),
            img: img,
          },
          ...user.notifys,
        ];
        await user.save();
      }
    }
    res.status(StatusCodes.OK).json({
      message: "Tạo url thanh toán thành công",
      data: result.data,
    });
  } catch (error) {}
};
const callbackPay = async (req, res) => {
  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);
    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where apptransid =",
        dataJson["apptransid"]
      );

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  res.json(result);
};
const checkOrderPay = async (req, res) => {
  const { orderId } = req.body;
  let postData = {
    app_id: config.app_id,
    app_trans_id: orderId, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const data = await axios(postConfig);
    if (data) {
      res.status(StatusCodes.OK).json({
        message: "Kiểm tra trạng thái  thành công",
        result: data.data,
      });
    }
  } catch (error) {
    res.status(StatusCodes.NO_CONTENT).json({
      message: "Kiểm tra dữ liệu thất bại",
      error: error,
    });
  }
};
const checkOrderPayHotel = async (req, res) => {
  const { orderId } = req.body;
  let postData = {
    app_id: config.app_id,
    app_trans_id: orderId, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const data = await axios(postConfig);
    if (data) {
      res.status(StatusCodes.OK).json({
        message: "Kiểm tra trạng thái  thành công",
        result: data.data,
      });
    }
  } catch (error) {
    res.status(StatusCodes.NO_CONTENT).json({
      message: "Kiểm tra dữ liệu thất bại",
      error: error,
    });
  }
};
module.exports = {
  sendRequestPay,
  callbackPay,
  checkOrderPay,
  checkOrderPayHotel,
};
