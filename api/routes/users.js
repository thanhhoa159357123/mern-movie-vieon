const router = require("express").Router();
const User = require("../models/User");
var CryptoJS = require("crypto-js");
const verify = require("../verifyToken");

// Cập nhật người dùng
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedUser); // Trả về và dừng hàm
    } catch (err) {
      // Nếu có lỗi, trả về lỗi và đảm bảo không tiếp tục gửi phản hồi
      if (!res.headersSent) {
        return res.status(500).json(err); // Trả về lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You can update only your account!"); // Cấm nếu không phải chính chủ
    }
  }
});

// Xóa người dùng
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("User has been deleted..."); // Trả về và dừng hàm
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err); // Trả về lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You can delete only your account!"); // Cấm nếu không phải chính chủ
    }
  }
});

// Lấy thông tin người dùng theo ID
router.get("/find/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc; // Lọc bỏ password
    return res.status(200).json(info); // Trả về thông tin người dùng
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json(err); // Trả về lỗi nếu có
    }
  }
});

// Lấy tất cả người dùng (Chỉ Admin mới có quyền)
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5) // Lấy 5 người dùng mới nhất nếu có query
        : await User.find();
      return res.status(200).json(users); // Trả về danh sách người dùng
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err); // Trả về lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You cannot allowed to see all users!"); // Cấm nếu không phải Admin
    }
  }
});

// Thống kê người dùng theo tháng
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.getFullYear() - 1); // Lấy năm trước
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // Lấy tháng từ trường createdAt
        },
      },
      {
        $group: {
          _id: "$month", // Nhóm theo tháng
          total: { $sum: 1 }, // Tính tổng người dùng theo từng tháng
        },
      },
    ]);
    return res.status(200).json(data); // Trả về kết quả thống kê
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json(err); // Trả về lỗi nếu có
    }
  }
});

module.exports = router;
