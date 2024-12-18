const router = require("express").Router();
const List = require("../models/List");
const Movie = require("../models/Movie"); // Giả sử bạn có model Movie
const verify = require("../verifyToken");

// Create a new list
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      return res.status(201).json(savedList); // Gửi phản hồi và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ message: "Error creating list", error: err });
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");
    }
  }
});

// Delete a list
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      return res.status(200).json("The list has been deleted..."); // Gửi phản hồi và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ message: "Error deleting list", error: err });
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");
    }
  }
});

// Get lists based on query parameters (type and genre)
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } }, // Lọc theo type và genre
          { $sample: { size: 10 } },
        ]);
      } else {
        list = await List.aggregate([
          { $match: { type: typeQuery } }, // Chỉ lọc theo type
          { $sample: { size: 10 } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]); // Lấy mẫu 10 phim bất kỳ
    }
    return res.status(200).json(list); // Gửi phản hồi và dừng tiếp tục
  } catch (err) {
    if (!res.headersSent) {
      console.error("Error while fetching list:", err); // In lỗi chi tiết cho debug
      return res
        .status(500)
        .json({ message: "Error fetching list", error: err });
    }
  }
});

// Get movies in a specific list by list ID
router.post("/find", verify, async (req, res) => {
  const movieIds = req.body.ids; // Nhận mảng ID phim từ body
  if (!movieIds || movieIds.length === 0) {
    return res.status(400).json({ message: "No movie IDs provided" });
  }

  try {
    // Tìm các phim theo mảng ID phim
    const movies = await Movie.find({ _id: { $in: movieIds } }); // Tìm phim dựa trên mảng IDs
    return res.status(200).json(movies); // Gửi danh sách phim về client
  } catch (err) {
    console.error("Error while fetching movies:", err); // Log lỗi
    return res
      .status(500)
      .json({ message: "Error fetching movies", error: err });
  }
});

module.exports = router;
