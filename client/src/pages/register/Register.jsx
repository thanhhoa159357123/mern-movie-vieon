import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  // Hooks cho state, có thể dùng để quản lý lỗi nếu cần
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

  // Sử dụng useRef để tham chiếu các input
  const phonenumberRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef(); // Thêm ref cho email

  // Hàm xử lý đăng ký
  const handleFinish = async (e) => {
    e.preventDefault();  // Ngăn việc reload trang khi submit form

    const phonenumber = phonenumberRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const email = emailRef.current.value; // Lấy giá trị email

    try {
      // Gửi dữ liệu đăng ký lên server
      await axios.post("auth/register", {
        phonenumber,
        username,
        password,
        email, // Gửi email cùng với các thông tin khác
      });
      navigate("/login");  // Chuyển hướng người dùng tới trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <div className="register">
      <div className="top">
        <Link to="/" className="link">
          <span>VieON</span>
        </Link>
      </div>
      <div className="container">
        <form onSubmit={handleFinish}> {/* Sử dụng onSubmit để tránh reload trang */}
          <p>Đăng ký</p>
          <input
            type="tel"
            placeholder="Số điện thoại"
            ref={phonenumberRef}
            required
          />
          <input
            type="text"
            placeholder="Tên người dùng"
            ref={usernameRef}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            ref={passwordRef}
            required
          />
          <input
            type="email"  
            placeholder="Email"
            ref={emailRef}
            required
          />
          {error && <div className="error">{error}</div>}  {/* Hiển thị thông báo lỗi nếu có */}

          <span>
            Bạn đã có tài khoản ? 
            <Link to="/login" className="link">
              <span className="login_page"> Hãy Đăng Nhập.</span>
            </Link>
          </span>
          <button type="submit" className="registerButton"> {/* Chú ý sử dụng type="submit" */}
            Bắt đầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
