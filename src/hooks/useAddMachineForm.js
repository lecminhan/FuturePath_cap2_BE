import { useState } from 'react';
import axios from 'axios';

const useAddMachineForm = (onClose) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    model: '',
    capacity: '',
    status: 'AVAILABLE',
    locationId: '',
  });
  
  // Lấy host và token từ .env
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem('authToken');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_HOST}/api/machines`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Máy giặt đã được thêm thành công!');
      onClose(); // Đóng form/modal
      window.location.reload(); // Tải lại trang để hiển thị danh sách máy mới
    } catch (error) {
      console.error('Có lỗi xảy ra khi thêm máy giặt:', error);
      alert('Thêm máy giặt thất bại, vui lòng thử lại.');
    }
  };

  return { formData, handleChange, handleSubmit };
};

export default useAddMachineForm;
