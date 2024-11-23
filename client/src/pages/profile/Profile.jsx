import React, { useState, useEffect } from "react";
import "../profile/profile.scss";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [modal, setModal] = useState({ type: "", visible: false });
  const [userData, setUserData] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const location = useLocation();
  const { user } = location.state || {};

  // Hiển thị modal
  const showModal = (type) => setModal({ type, visible: true });

  // Ẩn modal
  const hideModal = () => {
    setModal({ type: "", visible: false });
    setInputValue("");
  };

  // Xử lý cập nhật thông tin
  const handleUpdate = async (field) => {
    try {
      const updatedData = { [field]: inputValue };
      const res = await axios.put(`/users/update/${user._id}`, updatedData, {
        headers: {
          token: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
      setUserData(res.data); // Cập nhật thông tin người dùng
      alert(
        `${
          field === "username"
            ? "Tên"
            : field === "email"
            ? "Email"
            : "Mật khẩu"
        } cập nhật thành công!`
      );
      hideModal();
    } catch (err) {
      console.error(`Lỗi cập nhật ${field}:`, err);
      alert("Không thể cập nhật. Vui lòng thử lại.");
    }
  };

  // Hàm lấy thông tin người dùng
  const getUserData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        setUserData(currentUser);
      } else if (user) {
        const res = await axios.get(`/users/find/${user._id}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setUserData(res.data);
      }
    } catch (err) {
      console.log("Lỗi lấy dữ liệu người dùng:", err);
    }
  };

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          setUserData(currentUser);
        } else if (user) {
          const res = await axios.get(`/users/find/${user._id}`, {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          });
          setUserData(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };

    fetchUserData();
  }, [user]);

  // Lấy danh sách xem
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Lấy thông tin người dùng từ localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.accessToken) {
          console.error("Không tìm thấy token hoặc người dùng không đăng nhập");
          return;
        }

        const token = currentUser.accessToken;
        const res = await axios.get(`/users/watchlist/${user._id}`, {
          headers: { token: `Bearer ${token}` },
        });

        // Kiểm tra cấu trúc dữ liệu trả về từ API
        if (res.data && res.data.movies) {
          setWatchlist(res.data.movies); // Cập nhật danh sách phim
        } else {
          console.error("Hiện tại chưa có phim trong kho", res.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách xem:", err);
        alert("Đã xảy ra lỗi khi tải danh sách xem.");
      }
    };

    if (user) fetchWatchlist();
  }, [user]);


  // Xóa phim khỏi danh sách xem
  const handleDelete = async (movieId) => {
    try {
      // Lấy token từ localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser || !currentUser.accessToken) {
        console.error("Không tìm thấy token hoặc người dùng không đăng nhập");
        return;
      }

      const token = currentUser.accessToken;

      // Gửi request xóa phim khỏi watchlist
      const res = await axios.delete(`/users/remove/watchlist/${user._id}`, {
        headers: { token: `Bearer ${token}` },
        data: { movieId }, // Gửi movieId trong body
      });

      // Cập nhật lại danh sách xem sau khi xóa
      if (res.status === 200) {
        setWatchlist(watchlist.filter((movie) => movie._id !== movieId));
        alert("Phim đã được gỡ khỏi danh sách xem!");
      } else {
        alert("Không thể gỡ phim khỏi danh sách.");
      }
    } catch (err) {
      console.error("Lỗi khi gỡ phim:", err);
      alert("Đã xảy ra lỗi khi gỡ phim.");
    }
  };

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
        <span className="information">Trang cá nhân</span>
        <div className="title">
          <span
            className={`tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Tài khoản và Cài đặt
          </span>
          <span
            className={`tab ${activeTab === "watchlist" ? "active" : ""}`}
            onClick={() => setActiveTab("watchlist")}
          >
            Danh sách xem
          </span>
        </div>
        <div className="main">
          {activeTab === "account" && (
            <div className="body">
              <div className="info-row">
                <span>
                  Chủ tài khoản: {userData.username || "Chưa cập nhật"}
                </span>
                <span
                  onClick={() => showModal("username")}
                  className="change-name-button"
                >
                  Đổi tên
                </span>
              </div>
              <div className="info-row">
                <span>Email: {userData.email || "Chưa cập nhật"}</span>
                <span
                  onClick={() => showModal("email")}
                  className="change-name-button"
                >
                  Cập nhật email
                </span>
              </div>
              <div className="info-row">
                <span>
                  Số điện thoại: {userData.phonenumber || "Chưa cập nhật"}
                </span>
              </div>
              <div className="info-row">
                <span>Mật khẩu: {"● ● ● ● ● ●"}</span>
                <span
                  onClick={() => showModal("password")}
                  className="change-name-button"
                >
                  Đổi mật khẩu
                </span>
              </div>
            </div>
          )}

          {activeTab === "watchlist" && (
            <div>
              {watchlist.length > 0 ? (
                <div className="watchlist">
                  {watchlist.map((movie) => (
                    <div className="movie" key={movie._id}>
                      <div className="movie-info">
                        <img
                          src={movie.img || "default-poster.jpg"} // Đường dẫn poster phim
                          alt={movie.title}
                          className="movie-poster"
                        />
                        <span className="movie-title">{movie.title}</span>
                      </div>
                      {/* Nút xóa */}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Gỡ phim
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <h4>Hiện tại chưa có phim nào trong danh sách của bạn</h4>
              )}
            </div>
          )}

          {/* Modal Đổi Tên */}
          {modal.visible && (
            <div className="modal-overlay" onClick={hideModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">
                  {modal.type === "username"
                    ? "Cập nhật họ tên"
                    : modal.type === "email"
                    ? "Cập nhật email"
                    : "Cập nhật mật khẩu"}
                </h2>
                <input
                  type={modal.type === "password" ? "password" : "text"}
                  className="modal-input"
                  placeholder={
                    modal.type === "username"
                      ? "Họ và tên"
                      : modal.type === "email"
                      ? "Email"
                      : "Mật khẩu mới"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="modal-buttons">
                  <button className="modal-button" onClick={hideModal}>
                    Bỏ qua
                  </button>
                  <button
                    className="modal-button"
                    onClick={() => handleUpdate(modal.type)}
                  >
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
