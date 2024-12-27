import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  CircularProgress,
  Container,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import useChartData from "../../hooks/useChartData";

const CombinedChart = () => {
  const { chartData, loading, error } = useChartData();

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Đang tải dữ liệu biểu đồ
        </Typography>
      </Container>
    );
  }

  // Hiển thị trạng thái error
  if (error) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }
  if (!chartData || !chartData.combinedChartData) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Typography variant="body1" sx={{ color: "#5B6C8F" }}>
          Không có dữu liệu khả dụng
        </Typography>
      </Container>
    );
  }

  const combinedData = chartData.combinedChartData;

  return (
    <Box sx={{ width: "102%", height: 380, marginTop: 1 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          marginBottom: 1,
          fontSize: "13px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Biểu đồ Thời gian Sử dụng Máy và Chi phí Giao dịch
      </Typography>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: combinedData.labels, // Trục X
            label: "Ngày",
          },
        ]}
        yAxis={[
          {
            id: "y1",
            label: "Thời gian (giờ)", // Trục Y1 bên trái
          },
          {
            id: "y2",
            label: "Chi phí (VND)", // Trục Y2 bên phải
            position: "right",
          },
        ]}
        series={[
          {
            data: combinedData.datasets[0].data,
            label: combinedData.datasets[0].label,
            yAxisKey: "y1", // Gắn với trục Y1
            color: "#FE876F", // Màu của đường biểu đồ cũ
            lineWidth: 2,
          },
          {
            data: combinedData.datasets[1].data,
            label: combinedData.datasets[1].label,
            yAxisKey: "y2", // Gắn với trục Y2
            color: "#88CEEF", // Màu của đường biểu đồ cũ
            lineWidth: 2,
          },
        ]}
        grid={{ vertical: true, horizontal: true }}
        height={350}
        sx={{
          "& .MuiChartsAxis-root": {
            fontSize: "12px",
          },
        }}
      />
    </Box>
  );
};

export default CombinedChart;
