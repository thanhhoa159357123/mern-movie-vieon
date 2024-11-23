import { AccountCircleOutlined, Search } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../navbar/navbar.scss";
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/AuthActions";

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái lưu từ khóa tìm kiếm
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Xử lý scroll
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  // Hàm xử lý điều hướng đến trang profile
  const handleProfile = () => {
    navigate("/profile", { state: { user } });
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`); // Chuyển hướng đến trang tìm kiếm với query
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    alert("Đăng xuất thành công!");
  };

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
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
        </div>
        <div className="right">
          <div className="search">
            {showSearchInput && (
              <input
                type="text"
                placeholder="Search..."
                className={`searchInput ${showSearchInput ? "show" : ""}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Lưu từ khóa vào state
                onKeyDown={handleSearch} // Xử lý khi nhấn Enter
              />
            )}
            <Search className="icon" onClick={handleSearchClick} />
          </div>
          <div className="profile">
            {user ? ( // Kiểm tra nếu có user
              <>
                <span>{user.username}</span>
                <div className="options">
                  <span className="setting_account" onClick={handleProfile}>Cài đặt tài khoản</span>
                  <span className="setting_account" onClick={handleLogout}>Đăng xuất</span>
                </div>
              </>
            ) : (
              <Link to="/login" className="link">
                <AccountCircleOutlined className="icon" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
