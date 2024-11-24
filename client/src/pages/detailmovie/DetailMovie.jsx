import React, { useState } from "react";
import "../detailmovie/detailmovie.scss";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";

const DetailMovie = () => {
  const location = useLocation();
  const { movie, user } = location.state || {};
  const [userList, setUserList] = useState(
    JSON.parse(localStorage.getItem("userList")) || []
  );
  console.log(movie);
  const handleAddToList = async () => {
    try {
      if (!user || !user._id) {
        alert("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }
      if (!movie || !movie._id) {
        alert("Không thể xác định phim. Vui lòng thử lại.");
        return;
      }
      const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
      if (!token) {
        alert("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
        return;
      }
      const response = await axios.put(
        `/users/update/watchlist/${user._id}`,
        { movieId: movie._id },
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Đã thêm phim vào danh sách yêu thích!");
        setUserList((prevList) => [...prevList, movie]);
        localStorage.setItem("userList", JSON.stringify([...userList, movie]));
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào danh sách:", error);
      if (error.response) {
        alert(`${error.response.data.error || error.response.statusText}`);
      } else {
        alert("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="detailmovie">
      <span className="top">
        <Navbar user={user} />
      </span>
      <div className="container">
        <div className="img_movie">
          <img src={movie.img} alt="Movie Poster" />
        </div>
        <div className="content_movie">
          <div className="content">
            <p className="desc">{movie.desc}</p>
            <div className="info">
              <span
                className="age_limit"
                style={{
                  backgroundColor:
                    movie.limit > 16
                      ? "rgba(255, 0, 0, 0.8)" // Đỏ nếu trên 16 tuổi
                      : movie.limit >= 13
                      ? "rgba(255, 255, 0, 0.8)" // Vàng nếu từ 13 đến dưới 16
                      : "rgba(0, 128, 0, 0.8)", // Xanh lá nếu dưới 13
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Độ Tuổi: +{movie.limit}
              </span>
              <span className="duration">Thời gian: {movie.duration}</span>
              <span className="release_year">Năm sản xuất: {movie.year}</span>
            </div>
          </div>
          <div className="buttons">
            <Link to="/watch" className="link" state={{ movie }}>
              <button className="button_watch">Xem ngay</button>
            </Link>
            <button className="button_add" onClick={handleAddToList}>
              Thêm vào danh sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMovie;
