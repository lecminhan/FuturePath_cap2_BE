import { useState, useEffect } from "react";
import axios from "axios";

const useTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [transactions, setTransactions] = useState([]); // Transaction data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const itemsPerPage = 6; // Items per page
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Get role from localStorage

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        let usageHistories = [];
        let ownerMachineIds = [];

        // Fetch usage histories
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

        // If ROLE_OWNER, fetch machine IDs and filter usage histories
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

          // Filter transactions by machineId
          usageHistories = usageHistories.filter((transaction) =>
            ownerMachineIds.includes(transaction.machineId)
          );
        }

        setTransactions(usageHistories); // Set filtered transactions
      } catch (err) {
        setError("Failed to fetch transactions"); // Handle error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTransactions(); // Fetch transactions when component mounts
  }, [token, roleName]); // Re-fetch if token or role changes

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Total pages calculation
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  };
};

export default useTransactions;
