import React from 'react';
import { ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';
import useUserList from '../../hooks/useUserList';
import style from './style.css';
import AddUserForm from '../AddUsersComponents/AddUser';
function formatDate(dateArray) {
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day); // month - 1 because months are 0-based in JavaScript
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
}
function Userpaginations() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const {
        currentItems,
        currentPage,
        totalPages,
        loading,
        error,
        handlePageChange,
    } = useUserList();
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    const handleOpenForm = () => setIsFormOpen(true);
    const handleCloseForm = () => setIsFormOpen(false);
    return (
        <div className='userlist'>
            <table className='userlist-table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Ngày tạo</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Số dư</th>
                        <th>Đăng nhập lần cuối </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((data) => (
                        <tr key={data.id}>
                            <td>{data.id}</td>
                            <td>{formatDate(data.createdAt)}</td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                            <td>{data.phone}</td>
                            <td>{data.balance}</td>
                            <td>{formatDate(data.lastLoginAt)}</td>
                            <td>xóa</td>
                        </tr>
                    ))}
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
            <div>
                <button onClick={handleOpenForm}><UserPlus/></button>
                 {isFormOpen && <AddUserForm onClose={handleCloseForm} />}
                </div>
        </div>
    );
}

export default Userpaginations;
