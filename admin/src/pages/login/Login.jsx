import React, { useContext, useState } from "react";
import { login } from "../../context/authContext/apiCalls"; // Giữ nguyên hàm login
import { AuthContext } from "../../context/authContext/AuthContext"; // Import context
import { useNavigate } from "react-router-dom"; // Để chuyển hướng người dùng sau khi login
import "./login.css";

export default function Login() {
  const [phone, setPhone] = useState(""); // Sử dụng phone thay vì email
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext); // Lấy dispatch từ context
  const navigate = useNavigate(); // Để điều hướng người dùng sau khi đăng nhập thành công

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ phonenumber: phone, password }, dispatch);
      navigate("/"); // Chuyển hướng khi đăng nhập thành công
    } catch (error) {
      console.log("Login failed: ", error);
    }
  };

  return (
    <div className="login">
      <form className="loginForm">
        <input
          type="text"
          placeholder="Phone number"
          className="loginInput"
          onChange={(e) => setPhone(e.target.value)} // Lưu số điện thoại vào state
        />
        <input
          type="password"
          placeholder="Password"
          className="loginInput"
          onChange={(e) => setPassword(e.target.value)} // Lưu mật khẩu vào state
        />
        <button
          className="loginButton"
          onClick={handleLogin}
          disabled={isFetching} // Disable nút khi đang đăng nhập
        >
          Login
        </button>
      </form>
    </div>
  );
}
