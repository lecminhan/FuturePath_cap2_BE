import { useState } from "react";
import axios from "axios";

function useSearchMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");

  // Search function to fetch machine data
  const searchMachines = async (searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_HOST}/api/machines`, {
        params: {
          search: searchTerm, // Use search parameter to filter machines
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setMachines(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { machines, loading, error, searchMachines }; // Ensure this is returned correctly
}

export default useSearchMachines;
