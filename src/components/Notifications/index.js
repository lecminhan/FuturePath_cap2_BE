import React, { useState } from 'react';
import { RefreshCcw, Bell, Sun } from 'lucide-react'; // Nhập các biểu tượng từ Lucide
import './NotificationIcons.css';

function NotificationIcons() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hàm để thực hiện hành động refresh
  const handleRefresh = () => {
    setIsRefreshing(true); // Cập nhật trạng thái để hiển thị biểu tượng "đang refresh"
    setTimeout(() => {
      // Giả lập thời gian thực hiện refresh, bạn có thể thay thế bằng API call hoặc các hành động khác
      console.log("Data refreshed!");
      setIsRefreshing(false); // Trở lại trạng thái bình thường sau khi refresh xong
    }, 2000); // Thời gian giả lập là 2 giây
  };

  return (
    <div className="notification-icons">
      <RefreshCcw
        className={`icon ${isRefreshing ? 'refreshing' : ''}`} // Đổi class khi đang refresh
        onClick={handleRefresh}
        style={{ cursor: 'pointer', color: '#9197B3', width: '24px', height: '24px' }} // Thiết lập kiểu
      />
      <Bell className="icon" style={{ color: '#9197B3', width: '24px', height: '24px' }} />
      <Sun className="icon" style={{ color: '#9197B3', width: '24px', height: '24px' }} />
    </div>
  );
}

export default NotificationIcons;
