import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react"; // Giữ lại icon Lucide
import {
  IconButton,
  Badge,
  Popover,
  Typography,
  Box,
  Button,
} from "@mui/material"; // Sử dụng các component từ MUI
import "./bell.css";

const IntegratedNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Quản lý vị trí Popover
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!token) return; // Nếu không có token, không thực hiện API call
    try {
      const response = await axios.get(
        `${API_HOST}/api/notifications/user/unread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    if (!token) return; // Nếu không có token, không thực hiện API call
    try {
      const response = await axios.get(`${API_HOST}/api/notifications/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    if (!token) return; // Nếu không có token, không thực hiện API call
    try {
      await axios.patch(`${API_HOST}/api/notifications/user/mark/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      fetchUnreadCount(); // Update unread count after marking as read
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
    setAnchorEl(event.currentTarget); // Gán anchorEl khi dropdown mở
    if (!showDropdown) fetchNotifications(); // Fetch notifications when dropdown is opened
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id); // Mark notification as read if not already read
    }
  };

  useEffect(() => {
    fetchUnreadCount(); // Fetch unread count initially
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Clear interval when component is unmounted
  }, []);

  return (
    <div className="integrated-notification">
      {/* Bell Icon with unread count */}
      <div onClick={toggleDropdown} className="notification-bell">
        <IconButton
          style={{
            color: unreadCount > 0 ? "#FF6B6B" : "#9197B3",
            position: "relative",
            padding: 0,
          }}
        >
          <Bell className="icon" style={{ width: "24px", height: "24px" }} />
          {unreadCount > 0 && (
            <span
              className="unread-count"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              {unreadCount}
            </span>
          )}
        </IconButton>
      </div>

      {/* Notification Dropdown */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)} // Đóng Popover khi click bên ngoài
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ padding: 2, minWidth: 250 }}>
          <Typography variant="h5">Thông báo</Typography>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Box
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "read" : "unread"
                }`}
                sx={{
                  padding: 1,
                  marginBottom: 1,
                  backgroundColor: notification.read ? "#f4f4f4" : "#e8f5e9",
                  cursor: "pointer",
                  borderRadius: 1,
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Không có thông báo
            </Typography>
          )}
        </Box>
      </Popover>

      {/* Notification Popup */}
      {selectedNotification && (
        <div className="notification-popup">
          <Box sx={{ padding: 2, width: 300 }}>
            <Typography variant="h6">Thông báo</Typography>
            <Typography variant="body1">
              {selectedNotification.message}
            </Typography>
            <Button
              onClick={() => setSelectedNotification(null)}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Đóng
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default IntegratedNotificationBell;
