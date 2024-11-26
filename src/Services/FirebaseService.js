import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../FirebaseConfig'; // Nhập `app` từ FirebaseConfig
import { getDatabase as getRealtimeDatabase } from 'firebase/database'; // Nhập lại getDatabase để sử dụng sau

// Khởi tạo Firebase app với `app` từ FirebaseConfig
const db = getRealtimeDatabase(app); // Sử dụng `app` đã được xuất từ FirebaseConfig

// Hàm lấy trạng thái của máy theo ID
export const getMachineStatus = async (machineId) => {
    try {
        const statusRef = ref(db, `machines/${machineId}/status`);
        const snapshot = await get(statusRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy trạng thái máy:', error);
        return null;
    }
};
