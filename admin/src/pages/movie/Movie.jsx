import { Link, useLocation, useNavigate } from "react-router-dom";
import { Publish } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";
import "./movie.css";

export default function Movie() {
  const location = useLocation();
  const movie = location.state?.movie; // Lấy thông tin từ state
  const navigate = useNavigate();

  // State để lưu thông tin phim khi người dùng chỉnh sửa
  const [updatedMovie, setUpdatedMovie] = useState({
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    limit: movie.limit,
    trailer: movie.trailer,
    video: movie.video,
    img: movie.img,
  });

  // Hàm xử lý sự thay đổi giá trị từ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi người dùng chọn tệp
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setUpdatedMovie((prev) => ({
        ...prev,
        [name]: files[0], // Lưu tệp đã chọn
      }));
    }
  };

  // Hàm gửi yêu cầu API để cập nhật phim
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", updatedMovie.title);
    formData.append("year", updatedMovie.year);
    formData.append("genre", updatedMovie.genre);
    formData.append("limit", updatedMovie.limit);
    formData.append("trailer", updatedMovie.trailer); // Truyền trailer file
    formData.append("video", updatedMovie.video); // Truyền video file
    formData.append("img", updatedMovie.img); // Truyền hình ảnh (file)

    try {
      // Gửi PUT request tới API với FormData
      const res = await axios.put(`/movies/${movie._id}`, formData, {
        headers: {
          token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      alert("Movie updated successfully!");
      navigate("/movies"); // Quay lại danh sách phim sau khi cập nhật thành công
    } catch (err) {
      console.error(err);
      alert("Failed to update movie");
    }
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Movie</h1>
        <Link to="/newMovie">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={updatedMovie.img} alt="" className="productInfoImg" />
            <span className="productName">{updatedMovie.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{movie._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{movie.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">year:</span>
              <span className="productInfoValue">{movie.year}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">limit:</span>
              <span className="productInfoValue">{movie.limit}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleUpdate}>
          <div className="productFormLeft">
            <label>Movie Title</label>
            <input
              type="text"
              name="title"
              value={updatedMovie.title}
              onChange={handleChange}
            />
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={updatedMovie.year}
              onChange={handleChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={updatedMovie.genre}
              onChange={handleChange}
            />
            <label>Limit</label>
            <input
              type="text"
              name="limit"
              value={updatedMovie.limit}
              onChange={handleChange}
            />
            <label>Trailer</label>
            <input
              type="file"
              name="trailer"
              onChange={handleFileChange}
            />
            <label>Video</label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={updatedMovie.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="productButton" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
