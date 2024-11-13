import { AccountCircleOutlined, Search } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.scss";
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/AuthActions";

const Navbar = ({ phoneNumber }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAvatar, setShowAvatar] = useState(!phoneNumber); // Xác định trạng thái hiển thị
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const handleProfile = () => {
    navigate("/profile", { state: { phoneNumber } });
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Dispatch hành động logout
    dispatch(logout());
    alert("Đăng xuất thành công!");
    setShowAvatar(true); // Chuyển về biểu tượng avatar
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <Link to="/" className="link">
            <span>VieON</span>
          </Link>
          <Link to="/series" className="link">
            <span>Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span>Movies</span>
          </Link>
          <span>New and Popular</span>
          <span>My List</span>
        </div>
        <div className="right">
          <button className="premium">Đăng kí gói</button>
          <Search className="icon" />
          <div className="profile">
            {showAvatar ? ( // Hiển thị avatar nếu không có số điện thoại
              <Link to="/login" className="link">
                <AccountCircleOutlined className="icon" />
              </Link>
            ) : (
              <>
                <span>{phoneNumber}</span>
                <div className="options">
                  <span onClick={handleProfile}>Settings</span>
                  <span onClick={handleLogout}>Logout</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
