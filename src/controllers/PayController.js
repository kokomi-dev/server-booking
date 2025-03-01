const axios = require("axios").default;
const qs = require("qs");
const CryptoJS = require("crypto-js");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");
const BookedAttractions = require("../models/BookedAttractions");
const BookedHotels = require("../models/BookedHotels");
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const sendRequestPay = async (req, res) => {
  const { amount, category } = req.body;
  const embed_data = {
    redirecturl: `${process.env.VNPAY_RETURN_URL}?category=${category}`,
    ...req.body,
  };
  const items = [{}];

  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123-kokotravel",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `KokoTravel - Thanh toán cho đơn hàng ID #${transID}`,
    bank_code: "",
    callback_url: `${process.env.VNPAY_REDIREC_URL}?category=${category}`,
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
    }
    res.status(StatusCodes.OK).json({
      message: "Tạo url thanh toán thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      mesage: error.mesage,
    });
  }
};
const checkOrderPay = async ({ orderId }) => {
  let postData = {
    app_id: config.app_id,
    app_trans_id: orderId,
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
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
      return data.data;
    }
  } catch (error) {
    return {
      message: "Kiểm tra dữ liệu thất bại",
    };
  }
};
const callbackPay = async (req, res) => {
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
    let category = req.query.category;
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    if (reqMac !== mac) {
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr);
      const { app_trans_id, embed_data } = dataJson;

      const parsedEmbedData = JSON.parse(embed_data);
      const {
        infoUser,
        infoAttraction,
        infoHotel,
        infoHotelRoom,
        unitCode,
        tripId,
        amount,
        numberTicketAdult,
        numberTicketChildren,
        hour,
        startDate,
        img,
        dateTo,
        dateFrom,
      } = parsedEmbedData;
      const res = await checkOrderPay({ orderId: app_trans_id });
      if (res && res.return_code == 1) {
        if (category === "attraction") {
          const bookedAtt = {
            slugBooked: tripId,
            infoUser,
            unitCode: unitCode,
            infoAttraction,
            paymentMethod: "zalopay",
            paymentUrl: app_trans_id,
            totalBooked: Number(amount),
            numberOfTicketsBooked: {
              adult: Number(numberTicketAdult),
              children: Number(numberTicketChildren),
            },
            hourStart: hour,
            dateStart: startDate,
            bookedDate: new Date(),
            img: img,
            isSuccess: true,
          };
          const bookedAttractions = new BookedAttractions(bookedAtt);
          await bookedAttractions.save();

          try {
            const [updateResponse, emailResponse] = await Promise.all([
              axios.put(
                `${process.env.LOCAL_HOST_PORT}/api/attraction/status`,
                {
                  id: tripId,
                  caseStatus: "update-number-tickets",
                  numberTicketAdult,
                  numberTicketChildren,
                }
              ),
              axios.post(
                `${process.env.LOCAL_HOST_PORT}/api/email/send-email-tickets`,
                {
                  ...bookedAtt,
                  category: "attraction",
                }
              ),
            ]);

            console.log("Update tickets response:", updateResponse.data);
            console.log("Email response:", emailResponse.data);
          } catch (error) {
            console.error(
              "Failed to process requests:",
              error.response ? error.response.data : error.message
            );
          }
        } else {
          const bookedH = {
            slugBooked: tripId,
            infoUser,
            infoHotel,
            infoHotelRoom,
            unitCode: unitCode,
            paymentMethod: "zalopay",
            paymentUrl: app_trans_id,
            totalBooked: Number(amount),
            numberOfTicketsBooked: {
              adult: Number(numberTicketAdult),
              children: Number(numberTicketChildren),
            },
            bookedDate: new Date(),
            img: img,
            dateTo,
            dateFrom,
            isSuccess: true,
          };
          const bookedHotel = new BookedHotels(bookedH);
          await bookedHotel.save();
          try {
            const [updateResponse, emailResponse] = await Promise.all([
              axios.put(`${process.env.LOCAL_HOST_PORT}/api/hotel/status`, {
                id: tripId,
                caseStatus: "update-number-room-booked",
                infoHotelRoom,
              }),
              axios.post(
                `${process.env.LOCAL_HOST_PORT}/api/email/send-email-tickets`,
                {
                  ...bookedH,
                  category: "hotel",
                }
              ),
            ]);

            console.log("Update tickets response:", updateResponse.data);
            console.log("Email response:", emailResponse.data);
          } catch (error) {
            console.error(
              "Failed to process requests:",
              error.response ? error.response.data : error.message
            );
          }
        }
      }
    }
  } catch (error) {
    return res.status(StatusCodes.OK).json({
      message: "Thanh toán không thành công",
      err: error.message,
    });
  }
};

module.exports = {
  sendRequestPay,
  callbackPay,
  checkOrderPay,
};
