import React, { useEffect, useState } from "react";
import { Info, PlayArrow } from "@mui/icons-material";
import "../featured/featured.scss";
import axios from "axios";

const Featured = ({ type, setGenre }) => {
  const [content, setContent] = useState({});

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        if (!type) return; // Nếu type không có giá trị, không thực hiện yêu cầu.
        const res = await axios.get(`/movies/random?type=${type}`, {
          headers: {
            token:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzIxM2I3ODMwMzEwMzgyZTI4M2E2NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTczMTQyMTE0NywiZXhwIjoxNzMxODUzMTQ3fQ.hoWpL8FH3F1QxtokNnHFyeEEu7yw9NoOcc4u4dv_Ea4",
          },
        });
        setContent(res.data[0]);
      } catch (err) {
        console.log(err);
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
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <img
        src="https://images.unsplash.com/photo-1516117172878-fd2c41f4a759"
        alt="Avatar Movie Poster"
      />
      <div className="info">
        <span className="desc">{content.desc}</span>
        <div className="buttons">
          <button className="play">
            <PlayArrow />
            <span>Xem phim</span>
          </button>
          <button className="more">
            <Info />
            <span>Chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
