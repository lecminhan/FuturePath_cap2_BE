import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDB } from '../FirebaseConfig'; // Điều chỉnh đường dẫn import nếu cần

const useStatus = () => {
    const [totals, setTotals] = useState({
        AVAILABLE: 0,
        IN_USE: 0,
        UNDER_MAINTENANCE: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = () => {
            setLoading(true); // Start loading

            const statusRef = ref(realtimeDB, 'machines'); // Đường dẫn đến dữ liệu máy giặt

            // Lắng nghe thay đổi trạng thái của máy giặt trong thời gian thực
            const unsubscribe = onValue(
                statusRef,
                (snapshot) => {
                    const newTotals = {
                        AVAILABLE: 0,
                        IN_USE: 0,
                        UNDER_MAINTENANCE: 0,
                    };

                    // Duyệt qua tất cả các máy giặt để tính tổng trạng thái
                    snapshot.forEach((machineSnapshot) => {
                        const machineStatus = machineSnapshot.val().status;
                        switch (machineStatus) {
                            case 'AVAILABLE':
                                newTotals.AVAILABLE += 1;
                                break;
                            case 'IN_USE':
                                newTotals.IN_USE += 1;
                                break;
                            case 'UNDER_MAINTENANCE':
                                newTotals.UNDER_MAINTENANCE += 1;
                                break;
                            default:
                                break;
                        }
                    });

                    setTotals(newTotals); // Cập nhật tổng số trạng thái
                    setLoading(false); // Kết thúc trạng thái loading
                },
                (err) => {
                    setError('Không thể lấy trạng thái máy');
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
