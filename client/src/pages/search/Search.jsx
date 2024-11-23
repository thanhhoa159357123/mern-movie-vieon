import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../search/Search.scss";
import axios from "axios";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q"); // Lấy từ khóa tìm kiếm từ URL
  const [movies, setMovies] = useState([]); // Lưu danh sách phim
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lưu lỗi nếu có

  useEffect(() => {
    const fetchMovies = async () => {
      if (query) {
        try {
          setLoading(true);
          const res = await axios.get(`/movies/search?q=${query}`);
          setMovies(res.data);
          setLoading(false);
        } catch (err) {
          setError("Lỗi khi tìm kiếm phim!");
          setLoading(false);
        }
      }
    };

    fetchMovies(); // Gọi hàm khi query thay đổi
  }, [query]); // Chạy lại khi `query` thay đổi

  return (
    <div className="search_page">
      <div className="top">
        <Link to="/" className="link">
          <span>VieON</span>
        </Link>
      </div>
      <div className="container">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : movies.length > 0 ? (
          <div className="result_film">
            {movies.map((movie) => (
              <Link
                key={movie._id}
                to="/watch"
                className="link"
                state={{ movie }}
              >
                <div className="movieItem">
                  <img src={movie.img} alt={movie.title} />
                  <span>{movie.title}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>Không tìm thấy phim nào!</p>
        )}
      </div>
    </div>
  );
};

export default Search;
