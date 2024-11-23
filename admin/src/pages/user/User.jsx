import {
  MailOutline,
  PermIdentity,
  PhoneAndroid,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import "./user.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import axios from "axios";

export default function User() {
  const [userData, setUserData] = useState(null); // Lưu dữ liệu người dùng
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng đã đăng nhập từ context
  const { userId } = useParams(); // Lấy userId từ URL
  
  // Lấy dữ liệu người dùng từ API khi có userId
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/users/find/${userId}`, {
          headers: {
            token: `Bearer ${user?.accessToken}`, // Thêm token vào header
          },
        });
        console.log("User Data from API:", res.data);
        setUserData(res.data); // Lưu dữ liệu người dùng vào state
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    if (userId && user?.accessToken) {
      getUser(); // Gọi hàm lấy dữ liệu người dùng theo ID
    }
  }, [userId, user?.accessToken]);

  // Nếu chưa có dữ liệu, hiển thị loading hoặc thông báo lỗi
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user">
      <div>
      <Link to="/users" className="backLink">Quay lại</Link>
      </div>
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTopTitle">
            <span className="userShowUsername">{userData.username}</span>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{userData.username}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{userData.phonenumber}</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{userData.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  value={userData.username}
                  className="userUpdateInput"
                  readOnly // Để user không sửa username
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  value={userData.email}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  value={userData.phonenumber}
                  className="userUpdateInput"
                />
              </div>
              <button className="userUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
