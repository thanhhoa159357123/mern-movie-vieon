import { useContext, useState } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Xóa thông báo lỗi trước đó
      setErrorMessage("");

      // Gọi hàm login và xử lý dispatch
      const result = await login({ phonenumber, password }, dispatch);
      if (!result.success) {
        setErrorMessage(result.message); // Hiển thị lỗi nếu có
      } else {
        navigate("/", { state: { phonenumber } }); // Điều hướng đến trang chủ nếu đăng nhập thành công
        // navigate("/", {phonenumber})
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setErrorMessage("Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };
  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
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
          <button className="loginButton" onClick={handleLogin}>
            Sign In
          </button>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <span>
            New to Netflix? <b>Sign up now.</b>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
