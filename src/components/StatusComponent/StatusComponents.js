import React, { useEffect, useState } from 'react';
import style from './style.css'
import axios from 'axios';
import useStatus from '../../hooks/useStatus';
const StatusComponent = ({ className }) => {
    const [statuses, setStatuses] = useState([]);
    const { totals, loading, error } = useStatus();  // Gọi hook useStatus
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    const statusText = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Sẵn sàng';
            case 'IN_USE':
                return 'Đang chạy';
            case 'UNDER_MAINTENANCE':
                return 'Đang bảo trì';
            default:
                return ''; // Trường hợp khác, nếu có
        }
    };
    return (
        <div>
            {totals ? (
                <div>
                    {className === 'available box-color' && (
                        <div className={`status-item ${className}`}>
                            <h3>{statusText('AVAILABLE')}</h3>
                            <p>{totals.AVAILABLE}</p>
                        </div>
                    )}

                    {className === 'active box-color' && (
                        <div className={`status-item ${className}`}>
                            <h3>{statusText('IN_USE')}</h3>
                            <p>{totals.IN_USE}</p>
                        </div>
                    )}

                    {className === 'maintenance box-color' && (
                        <div className={`status-item ${className}`}>
                            <h3>{statusText('UNDER_MAINTENANCE')}</h3>
                            <p>{totals.UNDER_MAINTENANCE}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>Không có trạng thái nào.</p>
            )}
        </div>
    );
};

export default StatusComponent;
