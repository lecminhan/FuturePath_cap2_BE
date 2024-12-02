import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bolt, LayoutDashboard, WashingMachine, ArrowLeftRight, UsersRound, SquarePen, OctagonAlert, ChevronRight, MapPinPlus } from 'lucide-react';
import './style.css';

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);  // Trạng thái điều khiển modal
  const navigate = useNavigate();

  // Hàm mở modal
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  // Hàm xử lý xác nhận đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Xóa token khỏi localStorage
    setIsModalOpen(false);  // Đóng modal
    window.location.reload();  // Tải lại trang sau khi đăng xuất
  };

  // Hàm hủy bỏ đăng xuất
  const handleCancel = () => {
    setIsModalOpen(false);  // Đóng modal nếu người dùng hủy bỏ
  };

  return (
    <div className="sidebar">
      <div className="title">
        <Bolt className="icon" />
        <h1>ILM Dashboard</h1>
      </div>
      <div className="navigationBar">
        <ul>
          <li>
            <LayoutDashboard />
            <Link to="/" className="link">Bảng điều khiển</Link>
            <ChevronRight />
          </li>
          <li>
            <WashingMachine />
            <Link to="/machine-status" className="link">Trạng thái máy giặt</Link>
            <ChevronRight />
          </li>
          <li>
            <ArrowLeftRight />
            <Link to="/revenue" className="link">Doanh thu</Link>
            <ChevronRight />
          </li>
          <li>
            <UsersRound />
            <Link to="/user-info" className="link">Thông tin người dùng</Link>
            <ChevronRight />
          </li>
          <li>
            <SquarePen />
            <Link to="/change" className="link">Quản lý giá</Link>
            <ChevronRight />
          </li>
          <li>
            <MapPinPlus/>
            <Link to="/locations" className="link">Quản lý địa điểm</Link>
            <ChevronRight />
          </li>
          <li>
            <OctagonAlert />
            <Link to="/alert" className="link">Thông báo</Link>
            <ChevronRight />
          </li>
          <br />
          <hr /> 
            <button className="lgout-button" onClick={handleLogoutClick}>Đăng xuất</button>
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="modal-actions">
              <button onClick={handleLogout}>Đồng ý</button>
              <button onClick={handleCancel}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
