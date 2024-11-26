import React from 'react';
import useAddUserForm from '../../hooks/useAddUsers';
import './AddUser.css';
import { X } from 'lucide-react';

const AddUserForm = ({ onClose }) => {
  const { formData, handleChange, handleSubmit } = useAddUserForm(onClose);

  return (
    <>
      {/* Overlay nền tối */}
      <div className="popup-overlay" onClick={onClose}></div>

      <div className="popup-form">
        <h2>Thêm Người Dùng</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Tên người dùng:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label>
            Mật khẩu:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Xác nhận mật khẩu:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <label>
            Họ tên:
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Điện thoại:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Thêm người dùng</button>
          <button type="button" onClick={onClose} className="btn-close">
            <X />
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUserForm;
