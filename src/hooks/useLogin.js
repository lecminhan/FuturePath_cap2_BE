import { useState } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import MUI components

const useLogin = (onLogin) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const API_HOST = process.env.REACT_APP_API_HOST;
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setOpenSnackbar(false); // Đóng snackbar khi bắt đầu đăng nhập

    try {
      // Gửi yêu cầu đăng nhập
      const response = await axios.post(`${API_HOST}/api/auth/login`, {
        usernameOrEmail,
        password,
      });

      // Nếu đăng nhập thành công và nhận được accessToken
      if (response.data.accessToken) {
        const accessToken = response.data.accessToken;
        console.log(response.data);
        // Lưu thông tin vào localStorage
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("tokenType", response.data.tokenType);

        const userInfoResponse = await axios.get(`${API_HOST}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        console.log(userInfoResponse.data);
        const roleName = userInfoResponse.data.roleName;
        console.log(roleName);
        // Lưu roleName vào localStorage
        localStorage.setItem("roleName", roleName);

        // Kiểm tra roleName, chỉ cho phép nếu là ROLE_ADMIN hoặc ROLE_OWNER
        if (roleName === "ROLE_ADMIN" || roleName === "ROLE_OWNER") {
          // Gọi onLogin và chuyển accessToken qua callback
          onLogin(accessToken);
        } else {
          // Nếu không có quyền, xoá token và thông báo lỗi
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("tokenType");
          localStorage.removeItem("roleName"); // Xoá roleName nếu không có quyền
          setErrorMessage("Bạn không có quyền truy cập.");
          setOpenSnackbar(true); // Mở snackbar với thông báo lỗi
        }
      }
    } catch (error) {
      // Xử lý các lỗi cụ thể
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          setErrorMessage("Tài khoản của bạn đã bị khóa");
        } else if (status === 401) {
          setErrorMessage("Tên đăng nhập hoặc mật khẩu không đúng.");
        } else if (status === 403) {
          setErrorMessage("Tài khoản của bạn đã bị khóa.");
        } else if (status === 500) {
          setErrorMessage("Lỗi máy chủ, vui lòng thử lại sau.");
        } else {
          setErrorMessage("Đã xảy ra lỗi không xác định.");
        }
      } else if (error.message === "Network Error") {
        setErrorMessage(
          "Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng."
        );
      } else {
        setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      }
      setOpenSnackbar(true); // Mở snackbar với thông báo lỗi
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return {
    usernameOrEmail,
    setUsernameOrEmail,
    password,
    setPassword,
    errorMessage,
    isLoading,
    handleLogin,
    openSnackbar,
    handleCloseSnackbar,
  };
};

export default useLogin;
