import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import style from "./style.css";
const RevenueDatePicker = ({ onDateRangeChange }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateRange, setDateRange] = useState([firstDayOfMonth, today]);
  const [startDate, endDate] = dateRange;
  const API_HOST = process.env.REACT_APP_API_HOST;

  const fetchRevenueData = async (start, end) => {
    try {
      const response = await axios.get(
        `${API_HOST}/api/usage-histories/total-revenue?start=${start}&end=${end}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      onDateRangeChange(response.data);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
    }
  };

  useEffect(() => {
    const start = `${firstDayOfMonth.toISOString().split("T")[0]}T00:00:00`;
    const end = `${today.toISOString().split("T")[0]}T23:59:59`;
    fetchRevenueData(start, end);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = `${startDate.toISOString().split("T")[0]}T00:00:00`;
      const end = `${endDate.toISOString().split("T")[0]}T23:59:59`;
      fetchRevenueData(start, end);
    }
  }, [startDate, endDate]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <DatePicker
        selected={startDate}
        onChange={(update) => setDateRange(update)}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        placeholderText="Chọn ngày giới hạn"
        isClearable
      />
    </div>
  );
};

export default RevenueDatePicker;
