import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../FirebaseConfig"; // Điều chỉnh đường dẫn import nếu cần

const useMachineStatus = (machineId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const statusRef = ref(realtimeDB, `machines/${machineId}/status`); // Đường dẫn đúng đến trạng thái máy giặt
    // Lắng nghe sự thay đổi trong trạng thái của máy giặt
    const unsubscribe = onValue(
      statusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setStatus(snapshot.val()); // Cập nhật trạng thái máy giặt khi có sự thay đổi
        } else {
          setStatus(null); // Nếu không có dữ liệu thì đặt trạng thái là null
        }
        setLoading(false); // Đã hoàn thành việc lấy dữ liệu
      },
      (err) => {
        setError("Không thể lấy trạng thái máy");
        console.error(err);
        setLoading(false);
      }
    );

    // Cleanup: Ngừng lắng nghe khi component bị hủy
    return () => unsubscribe();
  }, [machineId]);

  return { status, loading, error };
};

export default useMachineStatus;
