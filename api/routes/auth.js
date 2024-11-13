const router = require("express").Router();
const User = require("../models/User");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Server error", error: err });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ phonenumber: req.body.phonenumber });

    // Nếu người dùng không tồn tại, gửi phản hồi và dừng tiến trình
    if (!user) {
      return res.status(401).json("Sai mật khẩu hoặc tên đăng nhập!");
    }

    // Giải mã mật khẩu và kiểm tra tính hợp lệ
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    // Nếu mật khẩu không khớp, gửi phản hồi và dừng tiến trình
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Sai mật khẩu hoặc tên đăng nhập!");
    }

    // Tạo token JWT cho người dùng đã đăng nhập
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    // Bỏ mật khẩu khỏi đối tượng trả về
    const { password, ...info } = user._doc;

    // Gửi phản hồi thành công với token và thông tin người dùng
    return res.status(200).json({ ...info, accessToken });
  } catch (err) {
    // Gửi lỗi máy chủ nếu có lỗi xảy ra trong quá trình thực thi
    return res.status(500).json(err);
  }
});

module.exports = router;
