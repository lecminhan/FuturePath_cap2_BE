import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Bolt,
  LayoutDashboard,
  WashingMachine,
  ArrowLeftRight,
  UsersRound,
  SquarePen,
  MapPinPlus,
  ChevronRight,
  CreditCard,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import "./style.css";

function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Lấy roleName từ localStorage
  const roleName = localStorage.getItem("roleName");
  const token = localStorage.getItem("authToken");
  const API_HOST = process.env.REACT_APP_API_HOST;
  // Lấy dữ liệu từ API khi roleName là ROLE_OWNER
  useEffect(() => {
    if (roleName === "ROLE_OWNER") {
      axios
        .get(`${API_HOST}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [roleName]);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Lấy ký tự đầu tiên từ phải sang trái (fullname) và chữ đầu tiên từ trái sang phải (username)
  const getInitials = (fullname) =>
    fullname?.split(" ").slice(-1)[0][0].toUpperCase();
  const getFirstName = (fullname) => fullname?.split(" ").slice(-1)[0] || "";
  return (
    <div className="sidebar">
      <div className="title">
        {/* Hiển thị icon và tiêu đề khác nhau dựa trên roleName */}
        {roleName === "ROLE_OWNER" && userData ? (
          <>
            <div className="admin-header">
              <div className="admin-icon">{getInitials(userData.fullname)}</div>
              <div className="admin-info">
                <h1 className="admin-title">
                  Hi {getFirstName(userData.fullname)}!
                </h1>
                <div className="account-link-container">
                  <Link to="/ownerdetail" className="account-link">
                    Xem thông tin tài khoản
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : roleName === "ROLE_ADMIN" ? (
          <>
            <div className="admin-header">
              <div className="admin-icon">A</div>
              <h1 className="admin-title">Hi Admin!</h1>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="navigationBar">
        <ul>
          <li>
            <LayoutDashboard />
            <Link to="/" className="link">
              Bảng điều khiển
            </Link>
            <ChevronRight />
          </li>
          <li>
            <WashingMachine />
            <Link to="/machine-status" className="link">
              Trạng thái máy giặt
            </Link>
            <ChevronRight />
          </li>
          <li>
            <ArrowLeftRight />
            <Link to="/revenue" className="link">
              Doanh thu
            </Link>
            <ChevronRight />
          </li>
          <li>
            <UsersRound />
            <Link to="/user-info" className="link">
              Thông tin người dùng
            </Link>
            <ChevronRight />
          </li>
          <li>
            <SquarePen />
            <Link to="/change" className="link">
              Quản lý giá
            </Link>
            <ChevronRight />
          </li>
          <li>
            <MapPinPlus />
            <Link to="/locations" className="link">
              Quản lý địa điểm
            </Link>
            <ChevronRight />
          </li>

          {/* Mục Quản lý giao dịch chỉ hiển thị khi roleName là "ROLE_ADMIN" */}
          {roleName === "ROLE_ADMIN" && (
            <li>
              <CreditCard />
              <Link to="/ownerwithdraw" className="link">
                Quản lý giao dịch
              </Link>
              <ChevronRight />
            </li>
          )}
          <br />
          <hr />
          {/* Button Đăng Xuất */}
          <Button
            variant="outlined"
            startIcon={<LogOut />}
            sx={{
              color: "#d32f2f",
              borderColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#fbeaea",
                borderColor: "#d32f2f",
              },
              margin: 1,
            }}
            onClick={handleLogoutClick}
            Width="30%"
          >
            Đăng xuất
          </Button>
        </ul>
      </div>

      {/* Dialog Xác Nhận Đăng Xuất */}
      <Dialog open={isModalOpen} onClose={handleCancel}>
        <DialogTitle>Bạn có chắc chắn muốn đăng xuất?</DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button onClick={handleLogout} variant="contained" color="error">
            Đồng ý
          </Button>
          <Button onClick={handleCancel} variant="outlined">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Sidebar;
