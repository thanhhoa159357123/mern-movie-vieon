import { useContext, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Kiểm tra các trường bắt buộc
    if (!phonenumber.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Vui lòng nhập mật khẩu.");
      return;
    }
  
    // Gọi API đăng nhập nếu không thiếu trường nào
    const result = await login({ phonenumber, password }, dispatch);
    if (result.success) {
      navigate("/", dispatch);
    } else {
      setErrorMessage(result.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };
  return (
    <div className="login">
      <div className="top">
        <Link to="/" className="link">
          <span>VieON</span>
        </Link>
      </div>
      <div className="container">
        <form>
          <p>Đăng nhập</p>
          <input
            type="email"
            placeholder="Phone number"
            onChange={(e) => setPhonenumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Error Alert */}
          {errorMessage && (
            <div className="alert">
              <strong>Lỗi:</strong> {errorMessage}
            </div>
          )}
          <span>
            Chưa có tài khoản ?
            <Link to="/register" className="link">
              <span className="register_page"> Hãy Đăng Kí !</span>
            </Link>
          </span>
          <button className="loginButton" onClick={handleLogin}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
