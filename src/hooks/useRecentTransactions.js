import { useState, useEffect } from "react";
import axios from "axios";

const useRecentTransactions = () => {
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Lấy vai trò từ localStorage

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true); // Bắt đầu trạng thái loading
        let transactions = [];
        let ownerMachineIds = [];

        // Gọi API lấy danh sách usage histories
        const usageHistoriesResponse = await axios.get(
          `${API_HOST}/api/usage-histories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        transactions = usageHistoriesResponse.data;

        // Nếu vai trò là ROLE_OWNER, lấy danh sách machine IDs
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

          // Lọc transactions để chỉ lấy các mục trùng machineId
          transactions = transactions.filter((transaction) =>
            ownerMachineIds.includes(transaction.machineId)
          );
        }

        // Sắp xếp giao dịch theo thời gian giảm dần (giao dịch mới nhất trước)
        transactions.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Giữ lại 4 giao dịch mới nhất
        setUserTransactions(transactions.slice(0, 4));
      } catch (err) {
        setError("Failed to fetch data"); // Xử lý lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchTransactions(); // Gọi hàm lấy dữ liệu khi component render
  }, [token, roleName]); // Theo dõi thay đổi của token và vai trò

  return { userTransactions, loading, error };
};

export default useRecentTransactions;
