import { useEffect, useState } from "react";
import axios from "axios";
import {
  generateChartData,
  generateTimeChartData,
  generateCostChartData,
} from "../Services/ChartService";

const useChartData = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Lấy vai trò từ localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let usageHistories = [];
        let ownerMachineIds = [];

        // Gọi API để lấy usage histories
        const usageHistoriesResponse = await axios.get(
          `${API_HOST}/api/usage-histories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        usageHistories = usageHistoriesResponse.data;

        // Nếu vai trò là ROLE_OWNER, gọi API để lấy danh sách machine IDs
        if (roleName === "ROLE_OWNER") {
          const ownerResponse = await axios.get(
            `${API_HOST}/api/machines/owner/current`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            }
          );

          ownerMachineIds = ownerResponse.data.map((machine) => machine.id);

          // Lọc dữ liệu usage histories chỉ giữ lại những mục trùng machineId
          usageHistories = usageHistories.filter((usage) =>
            ownerMachineIds.includes(usage.machineId)
          );
        }

        // Tạo dữ liệu biểu đồ sau khi lọc
        const combinedChartData = generateChartData(usageHistories);
        const timeChartData = generateTimeChartData(usageHistories);
        const costChartData = generateCostChartData(usageHistories);

        setChartData({ combinedChartData, timeChartData, costChartData });
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Gọi API khi component được render
  }, [token, roleName]); // Re-fetch nếu token hoặc vai trò thay đổi

  return { chartData, loading, error };
};

export default useChartData;
