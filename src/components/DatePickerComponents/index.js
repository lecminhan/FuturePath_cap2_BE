import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Giữ nguyên import
import axios from "axios";
import { CalendarMonth } from "@mui/icons-material"; // Icon từ MUI
import { TextField, InputAdornment, Box } from "@mui/material"; // Sử dụng MUI TextField
import "react-datepicker/dist/react-datepicker.css"; // Giữ nguyên style của react-datepicker
import "./datepicker.css"; // Giữ nguyên style tùy chỉnh của bạn
import { border, width } from "@mui/system";

const RevenueDatePicker = ({ onDateRangeChange }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateRange, setDateRange] = useState([firstDayOfMonth, today]);
  const [startDate, endDate] = dateRange || [];
  const API_HOST = process.env.REACT_APP_API_HOST;
  const roleName = localStorage.getItem("roleName"); // Lấy roleName từ localStorage

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const day = date.getDate(); // Lấy ngày
    const month = date.getMonth() + 1; // Lấy tháng (tháng bắt đầu từ 0, nên cần cộng 1)
    const year = date.getFullYear(); // Lấy năm

    // Trả về định dạng ISO chuẩn [Ngày]-[Tháng]-[Năm] (DD-MM-YYYY)
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  const fetchRevenueData = async (start, end) => {
    try {
      let url = "";
      if (roleName === "ROLE_OWNER") {
        // Nếu role là ROLE_OWNER, dùng API khác và bỏ giờ
        url = `${API_HOST}/api/owners/revenue/range?startDate=${start}&endDate=${end}`;
      } else {
        // Nếu là role khác (ROLE_ADMIN), dùng API mặc định
        url = `${API_HOST}/api/usage-histories/total-revenue?start=${start}&end=${end}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      onDateRangeChange(response.data);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
    }
  };

  // Chạy khi component mount (lần đầu tiên)
  useEffect(() => {
    let start, end;
    if (roleName === "ROLE_OWNER") {
      // Nếu là ROLE_OWNER, không có giờ, chỉ lấy ngày
      start = formatDate(firstDayOfMonth);
      end = formatDate(today);
      console.log(start);
      console.log(end);
    } else {
      // Nếu là ROLE_ADMIN, giữ nguyên giờ
      start = `${firstDayOfMonth.toISOString().split("T")[0]}T00:00:00`;
      end = `${today.toISOString().split("T")[0]}T23:59:59`;
    }
    fetchRevenueData(start, end);
  }, []);

  // Chạy khi startDate hoặc endDate thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      let start, end;
      if (roleName === "ROLE_OWNER") {
        // Nếu là ROLE_OWNER, không có giờ, chỉ lấy ngày
        start = formatDate(startDate);
        end = formatDate(endDate);
      } else {
        // Nếu là ROLE_ADMIN, giữ nguyên giờ
        start = `${startDate.toISOString().split("T")[0]}T00:00:00`;
        end = `${endDate.toISOString().split("T")[0]}T23:59:59`;
      }
      fetchRevenueData(start, end);
    }
  }, [startDate, endDate]);

  // Custom Input with React.forwardRef using MUI TextField
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        inputRef={ref}
        value={value || ""}
        onClick={onClick}
        readOnly
        variant="outlined"
        fullWidth
        placeholder="Chọn ngày giới hạn"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarMonth sx={{ color: "#5B6C8F", cursor: "pointer" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          borderRadius: "4px",
          width: "200px",
          "& .MuiOutlinedInput-root": {
            border: "none", // Bỏ border
          },
        }}
      />
    </Box>
  ));

  return (
    <DatePicker
      selected={startDate}
      onChange={(update) => setDateRange(update)}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      placeholderText="Chọn ngày giới hạn"
      customInput={<CustomInput />}
      sx={{ border: "none", width: "240px" }}
    />
  );
};

export default RevenueDatePicker;
