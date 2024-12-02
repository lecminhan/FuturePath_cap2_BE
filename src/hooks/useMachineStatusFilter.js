import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database"; // Lắng nghe thay đổi từ Realtime Database
import { realtimeDB } from "../FirebaseConfig"; // Kết nối đến Firebase Realtime Database

const useMachineStatusFilter = (initialStatus = "") => {
  const [statusFilter, setStatusFilter] = useState(initialStatus); // Trạng thái đã chọn
  const [machines, setMachines] = useState([]); // Dữ liệu máy giặt
  const [filteredMachines, setFilteredMachines] = useState([]); // Máy giặt đã lọc
  const [loading, setLoading] = useState(true); // Đang tải dữ liệu
  const [error, setError] = useState(null); // Lỗi nếu có

  // Lấy dữ liệu từ Firebase
  useEffect(() => {
    const machinesRef = ref(realtimeDB, "machines"); // Lấy dữ liệu các máy giặt
    const unsubscribe = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const machinesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMachines(machinesArray); // Lưu dữ liệu máy giặt
        setLoading(false);
      } else {
        setError("Không có dữ liệu máy giặt");
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Lọc dữ liệu máy giặt theo trạng thái đã chọn
  useEffect(() => {
    if (statusFilter) {
      setFilteredMachines(
        machines.filter((machine) => machine.status === statusFilter)
      );
    } else {
      setFilteredMachines(machines); // Nếu không có filter, hiển thị tất cả
    }
  }, [statusFilter, machines]);

  // Hàm xử lý khi chọn trạng thái
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return {
    filteredMachines,
    loading,
    error,
    statusFilter,
    handleFilterChange,
  };
};

export default useMachineStatusFilter;
