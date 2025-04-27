const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");
const { formatDateToDDMMYYYY } = require("~/utils/formatDate");
const code = Math.floor(100000 + Math.random() * 900000);
const sendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"KoKoTravel" <no-reply@kokotravel.com>',
      to: email,
      subject: "Xác thực thanh toán cod - KoKoTravel",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #4CAF50; text-align: center;">KoKoTravel</h1>
          <p>Xin chào <strong>${email}</strong>,</p>
          <p>Cảm ơn bạn đã lựa chọn KoKoTravel. Để hoàn tất quá trình thanh toán, vui lòng sử dụng mã xác thực dưới đây:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; border: 1px dashed #4CAF50; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 28px; color: #333;">${code}</h2>
          </div>
          <p style="font-size: 14px; color: #666;">Mã xác thực này sẽ hết hạn sau <strong>1 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
          <p>Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
          <hr style="margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #888;">Trân trọng,<br><strong>Đội ngũ hỗ trợ khách hàng KoKoTravel</strong></p>
        </div>
      `,
    });
    return res.status(StatusCodes.OK).json({
      idEmail: info.messageId,
      message: "Gửi email thành công",
      code: code,
      toEmail: email,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Xảy ra lỗi khi thực hiện gửi email",
      error: error.message,
    });
  }
};

const sendEmailTicket = async (req, res) => {
  const {
    infoUser,
    email,
    category,
    totalBooked,
    paymentMethod,
    numberOfTicketsBooked,
    infoAttraction,
    bookedDate,
    infoHotel,
    infoHotelRoom,
    dateTo,
    dateFrom,
    isSuccess,
    dateStart,
  } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = {};
    if (category === "attraction") {
      info = await transporter.sendMail({
        from: '"KoKoTravel" <no-reply@kokotravel.com>',
        to: infoUser.email,
        subject: "Xác nhận đặt chỗ thành công - KoKoTravel",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h1 style="color: #003B96; text-align: center;">KoKoTravel</h1>
            <p>Xin chào <strong>${infoUser.email}</strong>,</p>
            <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của KoKoTravel. Chúng tôi xin xác nhận rằng bạn đã đặt thành công địa điểm du lịch với thông tin chi tiết như sau:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border: 2px dashed #333; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #222;">Thông tin đặt chỗ</h2>
              <p><strong>Địa điểm:</strong> ${infoAttraction.name}</p>
              <p><strong>Địa chỉ:</strong> ${infoAttraction.address}</p>
              <p><strong>Ngày đặt:</strong> ${formatDateToDDMMYYYY(
                bookedDate
              )}</p>

              <p><strong>Ngày khởi hành:</strong> ${formatDateToDDMMYYYY(
                dateStart
              )}</p>
              <p><strong>Số lượng vé:</strong></p>
              <ul style="padding: 4px; border: 1px dashed #003B96; border-radius: 2px;">
                <li>Người lớn: ${numberOfTicketsBooked.adult}</li>
                <li>Trẻ em: ${numberOfTicketsBooked.children}</li>
              </ul>
              <p><strong>Tổng số tiền:</strong> ${totalBooked.toLocaleString(
                "vi-VN"
              )} VND</p>
              <p><strong>Phương thức thanh toán:</strong> ${
                paymentMethod === "cod"
                  ? "Thanh toán khi nhận vé (COD)"
                  : paymentMethod ?? "Khác"
              }</p>

              ${
                isSuccess === true &&
                `<div style="padding: 4px;display:flex; justify-content: center; align-items: center; background-color:#018235; color:white; border-radius: 2px;"><span>Đã thanh toán</span></div>`
              }
            </div>
            
            <p>Vui lòng xuất trình email này khi đến địa điểm tập hợp hoặc bạn có thể liên hệ với đội ngũ hỗ trợ nếu có bất kỳ câu hỏi nào.</p>
            
            <hr style="margin: 20px 0;">
            <p style="text-align: center; font-size: 12px; color: #888;">Trân trọng,<br><strong>Đội ngũ hỗ trợ khách hàng KoKoTravel</strong></p>
          </div>
        `,
      });
    } else {
      info = await transporter.sendMail({
        from: '"KoKoTravel" <no-reply@kokotravel.com>',
        to: infoUser.email,
        subject: "Xác nhận đặt nơi lưu trú thành công - KoKoTravel",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #003B96; text-align: center;">KoKoTravel</h1>
        <p>Xin chào <strong>${infoUser.email}</strong>,</p>
        <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của KoKoTravel. Chúng tôi xin xác nhận rằng bạn đã đặt thành công địa điểm lưu trú với thông tin chi tiết như sau:</p>
      
        <div style="background-color: #f9f9f9; padding: 15px; border: 2px dashed #333; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #222;">Thông tin địa điểm</h2>
          <p><strong>Địa điểm:</strong> ${infoHotel.name}</p>
          <p><strong>Địa chỉ:</strong> ${infoHotel.address}</p>
          <hr style="margin: 20px 0;">
          <h2 style="color: #222;">Thông tin chi tiết phòng nghỉ</h2>
          ${infoHotelRoom
            .map(
              (room) => `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
              <p><strong>Tên phòng:</strong> ${room.name}</p>
              <p><strong>Số lượng đặt:</strong> ${room.numberBooked}</p>
            </div>
          `
            )
            .join("")}
            <hr style="margin: 20px 0;">
            <div style="padding: 4px; border: 1px dashed #003B96; border-radius: 2px;"> 
            <p>Ngày nhận phòng: ${formatDateToDDMMYYYY(dateFrom)}</p>
            <p>Ngày trả phòng: ${formatDateToDDMMYYYY(dateTo)}</p>
            </div>
          
            <hr style="margin: 20px 0;">

          <p><strong>Ngày đặt:</strong> ${formatDateToDDMMYYYY(bookedDate)}</p>
      
          <p><strong>Số lượng người:</strong></p>
          <ul>
            <li>Người lớn: ${numberOfTicketsBooked.adult}</li>
            <li>Trẻ em: ${numberOfTicketsBooked.children}</li>
          </ul>
          <p><strong>Tổng số tiền:</strong> ${totalBooked.toLocaleString(
            "vi-VN"
          )} VND</p>
          <p><strong>Phương thức thanh toán:</strong> ${
            paymentMethod === "cod"
              ? "Thanh toán khi nhận phòng (COD)"
              : paymentMethod ?? "Khác"
          }</p>
          ${
            isSuccess === true &&
            `<div style="padding: 4px;display:flex; justify-content: center; align-items: center; background-color:#018235; color:white; border-radius: 2px;"><span>Đã thanh toán</span></div>`
          }
        </div>
      
        <p>Vui lòng xuất trình email này khi đến địa điểm lưu trú để hoàn tất thủ tục nhận phòng hoặc bạn có thể liên hệ với đội ngũ hỗ trợ nếu có bất kỳ câu hỏi nào.</p>
      
        <hr style="margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #888;">Trân trọng,<br><strong>Đội ngũ hỗ trợ khách hàng KoKoTravel</strong></p>
      </div>
      
        `,
      });
    }

    return res.status(StatusCodes.OK).json({
      idEmail: info.messageId,
      message: "Gửi email thành công",
      toEmail: email,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Xảy ra lỗi khi thực hiện gửi email",
      error: error.message,
    });
  }
};

const sendEmailChangePassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"KoKoTravel" <no-reply@kokotravel.com>',
      to: email,
      subject: "Xác thực đổi mật khẩu - KoKoTravel",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #4CAF50; text-align: center;">KoKoTravel</h1>
          <p>Xin chào <strong>${email}</strong>,</p>
          <p>Cảm ơn bạn sử dụng cài đặt tài khoản của chúng tôi. Để hoàn tất quá trình đổi mật khẩu của bạn, vui lòng sử dụng mã xác thực dưới đây:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; border: 1px dashed #4CAF50; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 28px; color: #333;">${code}</h2>
          </div>
          <p style="font-size: 14px; color: #666;">Mã xác thực này sẽ hết hạn sau <strong>1 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
          <p>Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
          <hr style="margin: 20px 0;">
          <p style="text-align: center; font-size: 12px; color: #888;">Trân trọng,<br><strong>Đội ngũ hỗ trợ khách hàng KoKoTravel</strong></p>
        </div>
      `,
    });
    return res.status(StatusCodes.OK).json({
      idEmail: info.messageId,
      message: "Gửi email thành công",
      code: code,
      toEmail: email,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Xảy ra lỗi khi thực hiện gửi email",
      error: error.message,
    });
  }
};
module.exports = { sendEmail, sendEmailTicket, sendEmailChangePassword };
