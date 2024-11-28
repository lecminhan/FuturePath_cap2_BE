import { useState, useEffect } from "react";
import axios from "axios";

const useRevenueData = (API_HOST, onDateRangeChange) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState([firstDayOfMonth, lastDayOfMonth]);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, endDate] = dateRange;

  const fetchRevenueData = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_HOST}/api/usage-histories/total-revenue?start=${start}&end=${end}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setRevenueData(response.data);
      onDateRangeChange(response.data); // Optional callback
    } catch (err) {
      setError(err);
      console.error("Error fetching revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = `${firstDayOfMonth.toISOString().split("T")[0]}T00:00:00`;
    const end = `${lastDayOfMonth.toISOString().split("T")[0]}T23:59:59`;
    fetchRevenueData(start, end);
  }, []);

  return {
    dateRange,
    setDateRange,
    startDate,
    endDate,
    revenueData,
    loading,
    error,
  };
};

export default useRevenueData;
