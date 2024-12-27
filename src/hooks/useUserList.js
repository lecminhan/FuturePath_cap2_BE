import { useState, useEffect } from "react";

function useUserList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  // Fetch data when the component mounts or currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_HOST}/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, token]); // Re-fetch data when currentPage changes

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data
    ? data.slice(startIndex, startIndex + itemsPerPage)
    : [];
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    data,
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  };
}

export default useUserList;
