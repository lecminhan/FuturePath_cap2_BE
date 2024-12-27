import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../FirebaseConfig"; // Điều chỉnh đường dẫn import nếu cần
import { CircularProgress, Alert, Box, Typography } from "@mui/material"; // Import MUI components

const useStatus = () => {
  const [totals, setTotals] = useState({
    AVAILABLE: 0,
    IN_USE: 0,
    UNDER_MAINTENANCE: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const API_HOST = process.env.REACT_APP_API_HOST;
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true); // Start loading

      const roleName = localStorage.getItem("roleName"); // Lấy roleName từ localStorage
      const statusRef = ref(realtimeDB, "WashingMachineList"); // Đường dẫn đến dữ liệu máy giặt
      let machinesData = [];

      if (roleName === "ROLE_OWNER") {
        // Nếu là OWNER, gọi API và lấy dữ liệu máy giặt
        try {
          const response = await fetch(
            `${API_HOST}/api/machines/owner/current`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "ngrok-skip-browser-warning": "69420",
              },
            }
          );
          const apiData = await response.json();
          machinesData = apiData; // Dữ liệu máy giặt từ API
        } catch (err) {
          setError("Không thể lấy dữ liệu từ API");
          console.error(err);
          setLoading(false);
          return;
        }
      }

      // Lắng nghe thay đổi trạng thái của máy giặt trong Firebase
      const unsubscribe = onValue(
        statusRef,
        (snapshot) => {
          const newTotals = {
            AVAILABLE: 0,
            IN_USE: 0,
            UNDER_MAINTENANCE: 0,
          };

          // Duyệt qua tất cả các máy giặt trong Firebase
          snapshot.forEach((machineSnapshot) => {
            const machine = machineSnapshot.val();
            const machineStatus = machine.status; // Trạng thái máy giặt
            const machineSecretId = machineSnapshot.key; // Firebase key as secretId
            console.log(machineStatus);
            // Nếu là OWNER, chỉ tính những máy giặt có secretId trùng khớp với API
            if (roleName === "ROLE_OWNER") {
              // Duyệt qua tất cả các máy giặt trong dữ liệu API
              let matchedMachine = machinesData.find(
                (apiMachine) => apiMachine.secretId === machineSecretId
              );

              if (matchedMachine) {
                // Nếu trạng thái trùng nhau, cộng vào tổng
                if (machineStatus) {
                  switch (machineStatus) {
                    case "AVAILABLE":
                      newTotals.AVAILABLE += 1;
                      break;
                    case "IN_USE":
                      newTotals.IN_USE += 1;
                      break;
                    case "UNDER_MAINTENANCE":
                      newTotals.UNDER_MAINTENANCE += 1;
                      break;
                    default:
                      break;
                  }
                }
              }
            } else {
              // Nếu là ADMIN, tiếp tục tính như cũ
              if (machineStatus) {
                switch (machineStatus) {
                  case "AVAILABLE":
                    newTotals.AVAILABLE += 1;
                    break;
                  case "IN_USE":
                    newTotals.IN_USE += 1;
                    break;
                  case "UNDER_MAINTENANCE":
                    newTotals.UNDER_MAINTENANCE += 1;
                    break;
                  default:
                    break;
                }
              }
            }
          });

          setTotals(newTotals); // Cập nhật tổng số trạng thái
          setLoading(false); // Kết thúc trạng thái loading
        },
        (err) => {
          setError("Không thể lấy trạng thái máy");
          console.error(err);
          setLoading(false); // Kết thúc trạng thái loading
        }
      );

      // Cleanup: Ngừng lắng nghe khi component bị unmount
      return () => unsubscribe();
    };

    fetchStatus(); // Gọi hàm lấy trạng thái
  }, []); // Hook chỉ chạy khi component được mount lần đầu

  return { totals, loading, error }; // Trả về dữ liệu trạng thái, loading và lỗi
};

export default useStatus;
