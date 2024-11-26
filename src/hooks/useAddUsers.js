import { useState } from 'react';
import axios from 'axios';

const useAddUserForm = (onClose) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullname: '',
    phone: ''
  });

  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem('authToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra cấu hình API
    if (!API_HOST || !token) {
      alert("Cấu hình API không hợp lệ.");
      return;
    }

    try {
      const response = await axios.post(`${API_HOST}/api/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Người dùng đã được tạo thành công!");
        onClose(); // Đóng form sau khi đăng ký thành công
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return { formData, handleChange, handleSubmit };
};

export default useAddUserForm;
