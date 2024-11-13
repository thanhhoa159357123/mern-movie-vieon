import { ArrowBackOutlined } from "@mui/icons-material";
import "./watch.scss";
import { Link } from "react-router-dom";

const Watch = () => {
  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      <video
        className="video"
        autoPlay
        progress
        controls
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
      />
    </div>
  );
};

export default Watch;
