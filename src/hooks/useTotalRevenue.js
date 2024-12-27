import { useState, useEffect } from "react";
import axios from "axios";

const useTotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;

  // Helper function to get the first and last days of the current month
  const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    return { firstDayOfMonth, lastDayOfMonth };
  };

  // Fetch user role from localStorage or another source
  const getUserRole = () => {
    return localStorage.getItem("roleName"); // Assuming role is stored in localStorage
  };

  const fetchTotalRevenue = async (start, end) => {
    try {
      setLoading(true);
      setError(null);

      // Determine API endpoint based on role
      const role = getUserRole();
      const apiUrl =
        role === "ROLE_OWNER"
          ? `${API_HOST}/api/owners/revenue/total`
          : `${API_HOST}/api/usage-histories/total-revenue`;

      const response = await axios.get(`${apiUrl}?start=${start}&end=${end}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      setTotalRevenue(response.data);
    } catch (err) {
      setError("Failed to fetch revenue data");
      console.error("Error fetching total revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { firstDayOfMonth, lastDayOfMonth } = getCurrentMonthDates();

    const start = `${firstDayOfMonth.toISOString().split("T")[0]}T00:00:00`;
    const end = `${lastDayOfMonth.toISOString().split("T")[0]}T23:59:59`;

    fetchTotalRevenue(start, end);
  }, [API_HOST]); // Re-runs only if API_HOST changes

  return {
    totalRevenue,
    loading,
    error,
  };
};

export default useTotalRevenue;
