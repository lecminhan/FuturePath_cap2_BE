import { RefreshCcw, BellRing, Sun, Search } from "lucide-react";
import dashboard from "./dashboard.css";
import NotificationIcons from "../../components/Notifications";
import React, { useEffect, useState } from "react";
import StatusComponent from "../../components/StatusComponent/StatusComponents";
import CombinedChart from "../../components/ChartComponents/combinedChart";
import useRecentTransactions from "../../hooks/useRecentTransactions";
import useTotalRevenue from "../../hooks/useTotalRevenue";
import MapBox from "../../mapbox/mapbox";

// MUI Imports
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Paper,
  Stack,
} from "@mui/material";

function Dashboard() {
  const [loading, setLoading] = useState(true); // General loading state
  const [error, setError] = useState(null); // Error state
  const {
    userTransactions,
    loading: loadingTransactions,
    error: errorTransactions,
  } = useRecentTransactions();
  const {
    totalRevenue,
    loading: loadingRevenue,
    error: errorRevenue,
  } = useTotalRevenue();

  // Set general loading state based on the status of revenue and transactions
  useEffect(() => {
    if (loadingRevenue || loadingTransactions) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    // Handle errors
    if (errorRevenue || errorTransactions) {
      setError(errorRevenue || errorTransactions);
      setLoading(false); // Stop loading if there's an error
    }
  }, [loadingRevenue, loadingTransactions, errorRevenue, errorTransactions]);

  // Loading vô tận nếu không có server phản hồi
  if (loading) {
    return (
      <div
        className="dashboard"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={80} />
        <Typography variant="body1" sx={{ marginTop: 2, color: "#5B6C8F" }}>
          Đang tải dữ liệu, vui lòng chờ...
        </Typography>
      </div>
    );
  }

  // Hiển thị lỗi khi có lỗi tải doanh thu hoặc giao dịch
  if (error) {
    return (
      <Container
        className="dashboard"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          Không thể lấy dữ liệu trang chủ!
        </Alert>
      </Container>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
      <Box
        className="header"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Box className="reload" sx={{ marginLeft: "auto" }}>
          <NotificationIcons />
        </Box>
      </Box>

      {/* Section 1 */}
      <Stack direction="row" spacing={2} className="section1">
        <Box
          sx={{
            flex: 1,
            padding: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: 2,
            textAlign: "center",
          }}
          className="total-revenue-box"
        >
          <Typography variant="h6" sx={{ color: "#333333" }}>
            Tổng doanh thu
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "24px", fontWeight: "bold", color: "#333333" }}
          >
            {totalRevenue ? `${totalRevenue}` : "0"}
          </Typography>
        </Box>

        <StatusComponent className="available box-color" />
        <StatusComponent className="active box-color" />
        <StatusComponent className="maintenance box-color" />
      </Stack>

      {/* Section 2 */}
      <Stack
        sx={{ paddingLeft: 2.5, paddingRight: 2.5 }}
        direction="row"
        spacing={3}
        className="section2"
      >
        <Box
          className="chartSections"
          sx={{
            flex: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <CombinedChart />
        </Box>
        <Box
          sx={{
            flex: 0.7,
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" className="title-recentrans">
            Giao dịch gần đây
          </Typography>
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
                    style={{ marginLeft: "20px", color: "#5B6C8F" }}
                    key={transaction.usageId + transaction.userName}
                  >
                    <strong>Người dùng:</strong> {transaction.userName}
                    <br />
                    {formatDate(transaction.startTime)}
                    <br />
                    <strong>
                      <div
                        style={{
                          textAlign: "right",
                          marginRight: "20px",
                          color: "#2FE5B6",
                        }}
                      >
                        {transaction.cost.toLocaleString()} VND
                      </div>
                    </strong>
                    <hr style={{ width: "80%" }} />
                  </li>
                );
              })
            )}
          </ul>
        </Box>
      </Stack>

      {/* Map Section */}
      <Stack direction="row" spacing={1}>
        <Box>
          <MapBox />
        </Box>
      </Stack>
    </div>
  );
}

export default Dashboard;
