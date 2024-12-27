import { useState, useEffect } from "react";
import axios from "axios";

const useFetchWashingTypes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_HOST}/api/washing-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_HOST, token]);

  return { data, loading, error, setData };
};

export default useFetchWashingTypes;
