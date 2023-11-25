const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message:
              "Lỗi mã token không hợp lệ! Bạn nên thực hiện việc đăng nhập trước khi sử dụng các tính năng khác.",
            err: err.message,
          });
        }
        req.user = decoded.user;
        next();
      });

      if (!token) {
        return res.status(401).json({
          message: "Người dùng chưa thực hiện việc xác thực hoặc mã đã bị mất!",
        });
      }
    } else {
      return res.status(401).json({
        message: "Người dùng chưa thực hiện việc xác thực hoặc mã đã bị mất!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
};

module.exports = validateToken;
