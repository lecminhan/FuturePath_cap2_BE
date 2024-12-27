import React, { useState } from "react";
import NotificationIcons from "../../components/Notifications";
import RMachinepaginations from "../../components/Paginations/revenueMachinePaginations";
import RevenueDatePicker from "../../components/DatePickerComponents";
import { useNavigate } from "react-router-dom";
import useRecentTransactions from "../../hooks/useRecentTransactions";
import { CircularProgress, Box, Typography, Alert } from "@mui/material";
import "./revenue.css";

function Revenue() {
  const [totalRevenue, setTotalRevenue] = useState(null); // Tổng doanh thu
  const [loadingRevenue, setLoadingRevenue] = useState(false); // Loading state
  const [errorRevenue, setErrorRevenue] = useState(null); // Error state
  const {
    userTransactions,
    loading: loadingTransactions,
    error: errorTransactions,
  } = useRecentTransactions();
  const navigate = useNavigate();

  // Loading toàn trang
  if (loadingRevenue || loadingTransactions) {
    return (
      <div className="revenue loading">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress size={80} />
          <Typography sx={{ marginTop: 2, color: "#5B6C8F" }}>
            Đang tải dữ liệu doanh thu...
          </Typography>
        </Box>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (errorRevenue || errorTransactions) {
    return (
      <div className="revenue error">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <Alert
            severity="error"
            sx={{
              textAlign: "center",
              position: "absolute",
              right: 15,
              marginBottom: 2,
              bottom: 0,
            }}
          >
            Không thể lấy dữ liệu doanh thu!
          </Alert>
        </Box>
      </div>
    );
  }

  const handleDateRangeChange = (revenueData) => {
    setTotalRevenue(revenueData);
  };

  return (
    <div className="revenue">
      {/* Header */}
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="section-1">
        {/* Phần bên phải */}
        <div className="section-right">
          <div className="table4 box">
            <div className="machine-tablebox">
              <div className="Rmachine-paginations">
                <RMachinepaginations />
              </div>
            </div>
          </div>
        </div>

        {/* Phần bên trái */}
        <div className="section-left">
          <div className="table1 box">
            <div className="DatePicker">
              <RevenueDatePicker onDateRangeChange={handleDateRangeChange} />
            </div>
          </div>

          <div className="table2 box">
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "600",
                color: "#5B6C8F",
              }}
            >
              Tổng doanh thu
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "25px",
                color: "#5B6C8F",
              }}
            >
              {totalRevenue ? `${totalRevenue} VND` : "0 VND"}
            </Typography>
          </div>

          <div className="table3 box">
            <div className="title-recentrans">Giao dịch gần đây</div>
            <ul className="content-recentrans">
              {userTransactions.length === 0 ? (
                <li
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#5B6C8F",
                  }}
                >
                  Không có giao dịch nào
                </li>
              ) : (
                userTransactions.map((transaction) => {
                  const formatDate = (timeArray) => {
                    if (Array.isArray(timeArray)) {
                      const [year, month, day, hour, minute] = timeArray;
                      return `${day}-${month}-${year} ${hour}:${minute}`;
                    }
                    return "Invalid date";
                  };

                  return (
                    <li
                      style={{
                        marginLeft: "20px",
                        color: "#5B6C8F",
                      }}
                      key={transaction.usageId + transaction.userName}
                    >
                      <strong>Người dùng:</strong> {transaction.userName}
                      <br />
                      {formatDate(transaction.startTime)}
                      <div
                        style={{
                          textAlign: "right",
                          marginRight: "20px",
                          color: "#2FE5B6",
                          fontWeight: "bold",
                        }}
                      >
                        {transaction.cost.toLocaleString()} VND
                      </div>
                      <hr style={{ width: "80%" }} />
                    </li>
                  );
                })
              )}
            </ul>

            {/* Nút xem tất cả */}
            <div className="viewalltransactions">
              <button
                className="button-viewalltransactions"
                onClick={() => navigate("/transactions")}
              >
                Xem tất cả giao dịch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
