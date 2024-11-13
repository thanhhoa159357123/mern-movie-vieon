const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  // Lấy token từ header
  const authHeader = req.headers.token;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Tách token sau 'Bearer'

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        // Nếu có lỗi khi xác thực token, trả về mã lỗi 403
        return res.status(403).json("Token is not valid!");
      }

      // Nếu token hợp lệ, gán user vào req và tiếp tục xử lý request
      req.user = user;
      next();
    });
  } else {
    // Nếu không có token, trả về mã lỗi 401
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;
