// src/components/MachineStatusFilter.js

import React, { useState, useEffect } from "react";
import useMachineListTable from "../../hooks/useMachineListTable"; // Import the custom hook for table pagination
import useFirebaseMachineStatus from "../../hooks/useFirebaseMachineStatus"; // Import the new custom hook for Firebase

const MachineStatusFilter = () => {
  const [statusFilter, setStatusFilter] = useState(""); // Trạng thái đã chọn
  const [filteredMachines, setFilteredMachines] = useState([]); // Máy giặt đã lọc

  const {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  } = useMachineListTable(); // Use the custom hook for table pagination

  // Get Firebase machine statuses
  const firebaseStatus = useFirebaseMachineStatus(currentItems); // Firebase status data

  // Kết hợp dữ liệu máy giặt từ API và trạng thái từ Firebase
  useEffect(() => {
    if (currentItems.length > 0 && firebaseStatus.length > 0) {
      const combinedData = currentItems.map((machine) => {
        const status = firebaseStatus.find(
          (status) => status.machineId === machine.id
        );
        return {
          ...machine,
          status: status ? status.status : "unknown", // Nếu không có trạng thái, mặc định là "unknown"
        };
      });
      setFilteredMachines(combinedData); // Cập nhật danh sách máy giặt với trạng thái
    }
  }, [currentItems, firebaseStatus]);

  // Lọc dữ liệu máy giặt theo trạng thái
  useEffect(() => {
    if (statusFilter) {
      setFilteredMachines((prevMachines) =>
        prevMachines.filter((machine) => machine.status === statusFilter)
      );
    } else {
      // Nếu không có filter, hiển thị tất cả máy giặt đã có trạng thái từ Firebase
      setFilteredMachines(
        currentItems.map((machine) => ({
          ...machine,
          status:
            firebaseStatus.find((status) => status.machineId === machine.id)
              ?.status || "unknown",
        }))
      );
    }
  }, [statusFilter, currentItems, firebaseStatus]);

  // Hàm xử lý khi chọn trạng thái
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return <p>Đang tải dữ liệu máy giặt...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Lọc trạng thái máy giặt</h2>
      <select onChange={handleFilterChange} value={statusFilter}>
        <option value="">Tất cả trạng thái</option>
        <option value="AVAILABLE">Sẵn sàng</option>
        <option value="IN_USE">Đang sử dụng</option>
        <option value="MAINTENANCE">Bảo trì</option>
        <option value="ERROR">Lo</option>
      </select>

      <div>
        <h3>Danh sách máy giặt</h3>
        <ul>
          {filteredMachines.length === 0 ? (
            <li>Không có máy giặt với trạng thái này.</li>
          ) : (
            filteredMachines.map((machine) => (
              <li key={machine.id}>
                Máy giặt {machine.id} - Tên: {machine.name} - Model:{" "}
                {machine.model} - Trạng thái: {machine.status} - Dung tích:
                {machine.capacity}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination controls */}
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MachineStatusFilter;
