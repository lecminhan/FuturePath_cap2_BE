// useLocations.js
import { useState, useEffect } from "react";
import axios from "axios";

const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_HOST}/api/locations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        setLocations(response.data);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải danh sách địa điểm.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [token]);

  return { locations, loading, error };
};

export default useLocations;
