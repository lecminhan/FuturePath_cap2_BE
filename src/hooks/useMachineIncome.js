import { useMemo, useState, useEffect } from "react";
import axios from "axios";

const useMachineIncome = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${API_HOST}/api/usage-histories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        setData(response.data); // Set the data from the API response
      } catch (err) {
        setError("Failed to fetch data"); // Handle error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [token]); // Run once when the component mounts (token dependency)

  // Calculate income by machine using useMemo
  const incomeByMachine = useMemo(() => {
    if (!Array.isArray(data)) return {}; // Ensure data is an array

    const result = data.reduce((acc, usage) => {
      const { machineId, cost, machineName } = usage;

      if (!machineId || cost == null) return acc; // Skip if machineId or cost is missing

      if (acc[machineId]) {
        acc[machineId].totalIncome += cost;
      } else {
        acc[machineId] = {
          machineName,
          totalIncome: cost,
        };
      }
      return acc;
    }, {});

    return result;
  }, [data]);

  return { incomeByMachine, loading, error };
};

export default useMachineIncome;
