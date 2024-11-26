import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import useTransactions from '../../hooks/useTransactions'; // Import hook

function TransactionPaginations() {
    const {
        currentItems,
        currentPage,
        totalPages,
        loading,
        error,
        handlePageChange
    } = useTransactions(); // Gọi hook để lấy dữ liệu và các hàm xử lý
    
    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra: {error}</p>;

    return (
        <div className='transactions-list'>
            <table className='transactions-table'>
                <thead>
                    <tr>
                        <th>Giao dịch</th>
                        <th>Ngày & Giờ</th>
                        <th>Số tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                {currentItems.map((data) => {
                        const timestamp = data.timestamp; 
                        const date = `${timestamp[0]}-${String(timestamp[1]).padStart(2, '0')}-${String(timestamp[2]).padStart(2, '0')}`;  // YYYY-MM-DD
                        const time = `${String(timestamp[3]).padStart(2, '0')}:${String(timestamp[4]).padStart(2, '0')}`;  // HH:MM

                        return (
                            <tr key={data.id}>
                                <td>Giao dịch từ {data.userName}</td>
                                <td> {date} | {time}</td>
                                <td>{data.amount} VND</td>
                                <td>{data.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        border: 0,
                        borderRadius: 10,
                        background: '#fff',
                        padding: '5px 10px',
                    }}
                >
                    <ChevronLeft className='chevronStyle' />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            backgroundColor: currentPage === index + 1 ? 'lightblue' : 'white',
                            border: 0,
                            borderRadius: 10,
                            padding: '5px 10px',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        border: 0,
                        borderRadius: 10,
                        background: '#fff',
                        padding: '5px 10px',
                    }}
                >
                    <ChevronRight className='chevronStyle' />
                </button>
            </div>
        </div>
    );
}

export default TransactionPaginations;
