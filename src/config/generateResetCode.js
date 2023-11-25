// Khởi tạo hàm tự động tạo mã reset code

function generateRandomCode(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Sử dụng hàm để tạo một mã ngẫu nhiên có độ dài 8
const randomCode = generateRandomCode(8);

module.exports = randomCode;
