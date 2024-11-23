import React, { useEffect, useState } from "react";
import "../featured/featured.scss";
import axios from "axios";

const Featured = ({ type, setGenre }) => {
  const [content, setContent] = useState({});

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        // Nếu `type` không có giá trị, lấy phim ngẫu nhiên từ bất kỳ loại nào.
        const url = type
          ? `/movies/random?type=${type}`
          : "/movies/random"; // Không có `type` => lấy tất cả
        const res = await axios.get(url, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setContent(res.data[0]); // Đặt dữ liệu ngẫu nhiên
      } catch (err) {
        console.error("Error fetching random content:", err);
      }
    };

    getRandomContent();
  }, [type]);

  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movies" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option>Genre</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="cartoon">Cartoon</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <img src={content.img} alt="Movie Poster" />
      <div className="info">
        <span className="desc">{content.desc}</span>
      </div>
    </div>
  );
};

export default Featured;
