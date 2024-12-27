import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../FirebaseConfig"; // Điều chỉnh đường dẫn nếu cần

const useMachineStatus = (secretId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!secretId) {
      setError("Không có secret_id hợp lệ");
      setLoading(false);
      return;
    }

    // Tham chiếu đến trạng thái máy trong Firebase
    const statusRef = ref(realtimeDB, `WashingMachineList/${secretId}/status`);

    // Lắng nghe dữ liệu từ Firebase
    const unsubscribe = onValue(
      statusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setStatus(snapshot.val());
        } else {
          setStatus("Không có dữ liệu");
        }
        setLoading(false);
      },
      (firebaseError) => {
        setError("Không thể lấy trạng thái máy");
        console.error("Firebase Error:", firebaseError);
        setLoading(false);
      }
    );

    // Cleanup: Hủy đăng ký khi component bị unmount
    return () => unsubscribe();
  }, [secretId]);

  return { status, loading, error };
};

export default useMachineStatus;
