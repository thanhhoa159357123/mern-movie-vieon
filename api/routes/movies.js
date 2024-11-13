const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

// Create a movie
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newMovie = new Movie(req.body);
      const savedMovie = await newMovie.save();
      return res.status(201).json(savedMovie);  // Gửi phản hồi và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err);  // Gửi lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");  // Cấm nếu không phải admin
    }
  }
});

// Update a movie
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedMovie);  // Gửi phản hồi và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err);  // Gửi lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");  // Cấm nếu không phải admin
    }
  }
});

// Delete a movie
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      return res.status(200).json("The movie has been deleted...");  // Gửi phản hồi và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err);  // Gửi lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");  // Cấm nếu không phải admin
    }
  }
});

// Get a movie by ID
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.status(200).json(movie);  // Gửi phản hồi và dừng tiếp tục
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json(err);  // Gửi lỗi nếu có
    }
  }
});

// Get a random movie
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    return res.status(200).json(movie);  // Gửi phản hồi và dừng tiếp tục
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json(err);  // Gửi lỗi nếu có
    }
  }
});

// Get all movies (only admin)
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      return res.status(200).json(movies.reverse());  // Gửi danh sách phim và dừng tiếp tục
    } catch (err) {
      if (!res.headersSent) {
        return res.status(500).json(err);  // Gửi lỗi nếu có
      }
    }
  } else {
    if (!res.headersSent) {
      return res.status(403).json("You are not allowed!");  // Cấm nếu không phải admin
    }
  }
});

module.exports = router;
