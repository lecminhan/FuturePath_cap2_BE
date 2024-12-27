import { useState, useEffect } from "react";
import axios from "axios";

const useMachineListFilter = (initialFilter) => {
  const [currentPage, setCurrentPage] = useState(initialFilter.page || 1); // Trang hiện tại
  const [data, setData] = useState([]); // Dữ liệu máy móc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [filter, setFilter] = useState(initialFilter); // Lọc dữ liệu

  const itemsPerPage = filter.size || 7; // Số lượng item trên mỗi trang

  const API_HOST = process.env.REACT_APP_API_HOST; // Đảm bảo đã cấu hình biến môi trường này

  // Gọi API để lấy dữ liệu máy móc
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_HOST}/api/machines`, {
          params: {
            page: currentPage,
            size: itemsPerPage,
            sortBy: filter.sortBy,
            sortDir: filter.sortDir,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "ngrok-skip-browser-warning": "69420", // Nếu cần xác thực
          },
        });

        // Log response to check the structure
        console.log(response.data);

        setData(response.data.content || []); // Giả sử dữ liệu trả về có cấu trúc { content: [] }
        setTotalPages(response.data.totalPages || 0); // Lấy tổng số trang
      } catch (err) {
        console.error("Error fetching data:", err); // Log the error
        setError(err.response ? err.response.data.message : "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filter, itemsPerPage]); // Chạy lại khi thay đổi filter hoặc trang

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm thay đổi bộ lọc (ví dụ: sắp xếp theo tên hoặc theo trạng thái)
  const handleFilterChange = (newFilter) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
    setCurrentPage(1); // Reset trang khi thay đổi bộ lọc
  };

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    handleFilterChange,
  };
};

export default useMachineListFilter;
