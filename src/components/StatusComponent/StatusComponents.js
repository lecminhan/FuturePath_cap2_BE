import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material"; // Import MUI components
import useStatus from "../../hooks/useStatus";

const StatusComponent = ({ className }) => {
  const [statuses, setStatuses] = useState([]);
  const { totals, loading, error } = useStatus(); // Gọi hook useStatus

  // Nếu đang loading, hiển thị CircularProgress
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Nếu có lỗi, hiển thị Alert
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const statusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Sẵn sàng";
      case "IN_USE":
        return "Đang chạy";
      case "UNDER_MAINTENANCE":
        return "Đang bảo trì";
      default:
        return ""; // Trường hợp khác, nếu có
    }
  };

  return (
    <Box>
      {totals ? (
        <Box>
          {className === "available box-color" && (
            <Box
              className={`status-item ${className}`}
              sx={{
                display: "flex", // Flexbox
                flexDirection: "column", // Căn chỉnh theo chiều dọc
                justifyContent: "center", // Căn giữa theo chiều dọc
                alignItems: "center", // Căn giữa theo chiều ngang
                padding: 0,
                boxShadow: 2,
                marginBottom: 0,
                height: 120, // Đặt chiều cao để đảm bảo căn giữa
                textAlign: "center", // Căn giữa chữ
                transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                "&:hover": {
                  transform: "translateY(-10px)", // Hiệu ứng nhảy lên khi hover
                },
              }}
            >
              <Typography variant="h6">{statusText("AVAILABLE")}</Typography>
              <Typography variant="body1">{totals.AVAILABLE}</Typography>
            </Box>
          )}

          {className === "active box-color" && (
            <Box
              className={`status-item ${className}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                boxShadow: 2,
                marginBottom: 0,
                height: 120,
                textAlign: "center",
                transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                "&:hover": {
                  transform: "translateY(-10px)", // Hiệu ứng nhảy lên khi hover
                },
              }}
            >
              <Typography variant="h6">{statusText("IN_USE")}</Typography>
              <Typography variant="body1">{totals.IN_USE}</Typography>
            </Box>
          )}

          {className === "maintenance box-color" && (
            <Box
              className={`status-item ${className}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                boxShadow: 2,
                marginBottom: 0,
                height: 120,
                textAlign: "center",
                transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                "&:hover": {
                  transform: "translateY(-10px)", // Hiệu ứng nhảy lên khi hover
                },
              }}
            >
              <Typography variant="h6">
                {statusText("UNDER_MAINTENANCE")}
              </Typography>
              <Typography variant="body1">
                {totals.UNDER_MAINTENANCE}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body1" color="textSecondary" textAlign="center">
          Không có trạng thái nào.
        </Typography>
      )}
    </Box>
  );
};

export default StatusComponent;
