import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext); // Lấy thông tin user và dispatch từ context
  const navigate = useNavigate(); // Để điều hướng người dùng

  // Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    dispatch({ type: "LOGOUT" }); // Cập nhật trạng thái trong context (nếu có reducer)
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link to="/" className="link">
            <span className="logo">Admin</span>
          </Link>
        </div>
        <div className="topRight">
          <div className="usernameWrapper">
            <span className="username">{user?.username}</span>
            <button className="logoutButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
