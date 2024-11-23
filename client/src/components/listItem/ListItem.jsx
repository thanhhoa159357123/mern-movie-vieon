import React, { useEffect, useState } from "react";
import "../listItem/listItem.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const ListItem = ({ index, item, user }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    if (item) {
      const getMovie = async () => {
        try {
          const res = await axios.get("/movies/find/" + item, {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          });
          setMovie(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getMovie();
    } else {
      console.log("Lỗi lấy dữ liệu.....");
    }
  }, [item]);
  return (
    <Link to="/detail_movie" state={{ movie, user }}>
      <div
        className={`listItem ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={movie.img} alt="poster" />
        {isHovered && (
          <>
            <video src={movie.video} autoPlay={true} loop muted />
          </>
        )}
      </div>
    </Link>
  );
};

export default ListItem;
