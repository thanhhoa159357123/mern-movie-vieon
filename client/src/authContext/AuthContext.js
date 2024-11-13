import AuthReducer from "./AuthReducer";
import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: null,  // Khởi tạo là null, sẽ cập nhật sau khi lấy từ localStorage
  isFetching: false,
  error: false,
};

// Tạo context
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // Cố gắng parse dữ liệu nếu có
        const parsedUser = JSON.parse(storedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: parsedUser });
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      // Lưu trữ user vào localStorage nếu có user trong state
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
