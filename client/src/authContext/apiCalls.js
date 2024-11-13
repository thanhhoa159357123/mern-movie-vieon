import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
    return { success: true }; // Trả về thành công
  } catch (err) {
    dispatch(loginFailure());
    console.error("Chi tiết lỗi đăng nhập:", err.response?.data); // Ghi chi tiết lỗi
    return { success: false, message: err.response?.data || "Login failed" }; // Trả về lỗi
  }
};
