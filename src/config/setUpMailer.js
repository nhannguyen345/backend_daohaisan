const nodemailer = require("nodemailer");
// khởi tạo transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "ando55559@gmail.com",
    // pass: "tjsfmucgokiabeea",
    user: process.env.USERMAIL,
    pass: process.env.PASSWORD,
  },
});

// Config mail
const mailOptions = function (to, code) {
  //console.log(process.env.USERNAME, process.env.PASSWORD);
  return {
    from: "ando55559@gmail.com",
    to: to,
    subject: "Mã xác thực đổi mật khẩu",
    text: `Đây là mã xác nhận (lưu ý thời hạn sử dụng là 3 phút): ${code}`,
  };
};

module.exports = { transporter, mailOptions };
