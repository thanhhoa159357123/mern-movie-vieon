import React, { useState, useEffect, useContext } from "react";
import "../profile/profile.scss";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../authContext/AuthContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [userData, setUserData] = useState({});
  const location = useLocation(); // Dùng useLocation để lấy phoneNumber từ state
  const phoneNumber = location.state?.phoneNumber; // Lấy phoneNumber từ state

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleShowChangeNameModal = () => setShowChangeNameModal(true);

  const handleHideChangeNameModal = () => {
    setShowChangeNameModal(false);
    setNewName("");
  };

  const handleNameChange = (e) => setNewName(e.target.value);

  const handleSaveName = async () => {
    // Lưu tên mới, nếu cần thiết
  };

  useEffect(() => {
    if (phoneNumber) {
      const getUserData = async () => {
        // Kiểm tra nếu có phoneNumber
        try {
          // Giả sử API của bạn có endpoint nhận số điện thoại
          const res = await axios.get("/users/find/" + phoneNumber, {
            headers: {
              token:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzIxM2I3ODMwMzEwMzgyZTI4M2E2NyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTczMTQyMTE0NywiZXhwIjoxNzMxODUzMTQ3fQ.hoWpL8FH3F1QxtokNnHFyeEEu7yw9NoOcc4u4dv_Ea4",
            },
          });
          setUserData(res.data); // Lưu dữ liệu người dùng vào state
        } catch (err) {
          console.log("Lỗi lấy dữ liệu người dùng:", err);
        }
      };
      getUserData();
    } else {
      console.log("Không tìm thấy người dùng");
    }
  }, [phoneNumber]);

  return (
    <div className="Profile">
      <div className="top">
        <div className="wrapper">
          <Link to="/" className="link">
            <span>VieON</span>
          </Link>
        </div>
      </div>
      <div className="container">
        <h3>Trang cá nhân</h3>
        <div className="title">
          <span
            className={`tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => handleTabClick("account")}
          >
            Tài khoản và Cài đặt
          </span>
        </div>
        <div className="main">
          {activeTab === "account" && (
            <div>
              <div className="info-row">
                <span>
                  Chủ tài khoản: {userData.username || "Chưa cập nhật"}
                </span>
                <span
                  onClick={handleShowChangeNameModal}
                  className="change-name-button"
                >
                  Đổi tên
                </span>
              </div>
              <div className="info-row">
                <span>
                  Email: {userData.email || "Chưa cập nhật"}{" "}
                  <span className="check-icon">✓</span>
                </span>
                <span>Cập nhật email</span>
              </div>
              <div className="info-row">
                <span>
                  Số điện thoại: {userData.phonenumber || "Chưa cập nhật"}{" "}
                  <span className="check-icon">✓</span>
                </span>
                <span>Cập nhật số điện thoại</span>
              </div>
              <div className="info-row">
                <span>Mật khẩu: {userData.password || "● ● ● ● ● ●"}</span>
                <span>Đổi mật khẩu</span>
              </div>
            </div>
          )}

          {/* Modal Đổi Tên */}
          {showChangeNameModal && (
            <div className="modal-overlay" onClick={handleHideChangeNameModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Cập nhật họ tên</h2>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Họ và tên"
                  value={newName}
                  onChange={handleNameChange}
                />
                <div className="modal-buttons">
                  <button
                    className="modal-button"
                    onClick={handleHideChangeNameModal}
                  >
                    Bỏ qua
                  </button>
                  <button className="modal-button" onClick={handleSaveName}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
