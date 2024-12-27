import { useState } from "react";
import axios from "axios";

const useAddUserForm = (onClose, setSnackbar) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullname: "",
    phone: "",
  });

  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra cấu hình API
    if (!API_HOST || !token) {
      setSnackbar({
        open: true,
        message: "Cấu hình API không hợp lệ.",
        severity: "error",
      });
      return;
    }

    setSnackbar({ open: true, message: "Đang xử lý...", severity: "info" }); // Hiển thị loading hoặc đang xử lý

    try {
      const response = await axios.post(
        `${API_HOST}/api/auth/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Người dùng đã được tạo thành công!",
          severity: "success",
        });
        onClose(); // Đóng form sau khi đăng ký thành công
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        severity: "error",
      });
    }
  };

  return { formData, handleChange, handleSubmit };
};

export default useAddUserForm;
