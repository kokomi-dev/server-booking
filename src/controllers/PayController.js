const crypto = require("crypto");
const querystring = require("querystring");

const sendRequestPay = (req, res) => {
  const vnp_TmnCode = process.env.VNPAY_CODE;
  const vnp_HashSecret = process.env.VNPAY_SECRET;
  const vnp_Url = process.env.VNPAY_URL;
  const vnp_ReturnUrl = "http://localhost:3000/attractions";

  const ipAddr = req.ip;

  const tmnCode = vnp_TmnCode;
  const secretKey = vnp_HashSecret;
  const vnpUrl = vnp_Url;
  const returnUrl = vnp_ReturnUrl;

  const date = new Date();
  const createDate = dateFormat(date, "yyyymmddHHMMss");
  const orderId = date.getTime().toString();
  const amount = req.body.amount * 100;
  const bankCode = req.body.bankCode;

  const orderInfo = `Thanh toan don hang ${orderId}`;
  const orderType = "billpayment";
  const locale = "vn";
  const currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Locale: locale,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Sắp xếp các tham số theo thứ tự từ điển để tạo chuỗi mã hóa chính xác
  vnp_Params = sortObject(vnp_Params);

  // Tạo chuỗi dữ liệu để mã hóa
  const signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  // Mã hóa bằng HMAC-SHA512
  const secureHash = crypto
    .createHmac("sha512", secretKey)
    .update(signData)
    .digest("hex");

  vnp_Params["vnp_SecureHash"] = secureHash;

  const vnpUrlWithParams =
    vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: true });

  // Chuyển hướng người dùng đến trang thanh toán VNPAY
  res.redirect(vnpUrlWithParams);
};

module.exports = { sendRequestPay };
