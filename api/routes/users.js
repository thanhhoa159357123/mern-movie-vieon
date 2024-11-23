const router = require("express").Router();
const User = require("../models/User");
const Movie = require("../models/Movie");
var CryptoJS = require("crypto-js");
const mongoose = require('mongoose');
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
    return res.status(200).json(user._doc); // Trả về thông tin người dùng
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

// Cập nhật thông tin người dùng
router.put("/update/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updatedFields = {};

    // Kiểm tra và cập nhật từng trường nếu có
    if (username) {
      // Kiểm tra trùng lặp username (nếu cần)
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Username đã tồn tại" });
      }
      updatedFields.username = username;
    }

    if (email) {
      // Kiểm tra trùng lặp email (nếu cần)
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Email đã tồn tại" });
      }
      updatedFields.email = email;
    }

    if (password) {
      console.log("Bắt đầu mã hóa mật khẩu...");
      const hashedPassword = CryptoJS.AES.encrypt(
        password,
        "secret-key"
      ).toString(); // Mã hóa mật khẩu
      updatedFields.password = hashedPassword;
    }

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Trả về thông tin người dùng đã được cập nhật
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Lỗi server:", err);

    // Kiểm tra lỗi mongoose nếu có
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Dữ liệu không hợp lệ", details: err });
    }

    // Trả về lỗi 500 cho các lỗi không xác định
    res.status(500).json({
      error: "Lỗi cập nhật thông tin người dùng",
      details: err.message,
    });
  }
});

// Thêm phim vào danh sách xem (watchlist)
router.put("/update/watchlist/:id", verify, async (req, res) => {
  try {
    const { movieId } = req.body; // Lấy movieId từ body request

    // Kiểm tra xem movieId có được cung cấp không
    if (!movieId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kiểm tra xem phim đã có trong danh sách xem chưa
    if (!user.watchlist.includes(movieId)) {
      // Thêm phim vào watchlist
      user.watchlist.push(movieId);
      await user.save(); // Lưu lại thay đổi

      return res
        .status(200)
        .json({ message: "Phim đã được thêm vào danh sách của bạn" });
    } else {
      return res
        .status(400)
        .json({ error: "Phim đã tồn tại trong danh sách của bạn" });
    }
  } catch (err) {
    console.error("Error adding movie to watchlist:", err);
    return res
      .status(500)
      .json({ error: "Server error while updating watchlist" });
  }
});

// Lấy phim ra
router.get("/watchlist/:id", verify, async (req, res) => {
  try {
    // Tìm người dùng theo ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kiểm tra nếu watchlist rỗng
    if (!user.watchlist || user.watchlist.length === 0) {
      return res.status(200).json({ watchlist: [] });
    }

    // Truy vấn thông tin chi tiết của các phim từ watchlist
    const movies = await Movie.find({ _id: { $in: user.watchlist } });

    return res.status(200).json({ movies });
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching watchlist" });
  }
});

// Xóa phim khỏi watchlist
router.delete("/remove/watchlist/:id", verify, async (req, res) => {
  try {
    const { movieId } = req.body; // Lấy movieId từ body request

    // Kiểm tra xem movieId có được cung cấp không
    if (!movieId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    // Kiểm tra nếu movieId có phải là ObjectId hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid Movie ID format" });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(req.params.id);
    
    console.log("User watchlist:", user.watchlist);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Movie ID:", movieId);

    // Kiểm tra xem phim có trong danh sách xem của người dùng không
    const movieIndex = user.watchlist.indexOf(movieId);
    if (movieIndex === -1) {
      return res
        .status(400)
        .json({ error: "Phim này không nằm trong danh sách của bạn" });
    }

    // Xóa phim khỏi watchlist
    user.watchlist.splice(movieIndex, 1);

    // Lưu lại thay đổi
    await user.save();

    return res
      .status(200)
      .json({ message: "Đã xóa phim khỏi danh sách của bạn" });
  } catch (err) {
    console.error("có lỗi khi xóa phim: ", err);
    return res
      .status(500)
      .json({ error: "Server error while removing movie from watchlist" });
  }
});

module.exports = router;
