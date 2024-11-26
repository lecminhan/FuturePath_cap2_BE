import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CircleX, Pen } from 'lucide-react';
import useMachineListTable from '../../hooks/useMachineListTable';
import useDeleteMachine from '../../hooks/useDeleteMachines';
import useTotalUsageTime from '../../hooks/useTotalUsageTime';
import useUpdateMachineName from '../../hooks/useUpdateMachineName';
import useMachineStatus from '../../hooks/useMachineStatus'; // Ensure this hook is imported correctly
import axios from 'axios';

function Machinepaginations() {
    const {
        currentItems,
        currentPage,
        totalPages,
        loading,
        error,
        handlePageChange,
    } = useMachineListTable();

    const { deleteMachine, deleteloading, deleteerror } = useDeleteMachine();

    const handleDelete = async (machineId) => {
        if (deleteloading) {
            alert('Đang xoá máy, vui lòng đợi...');
            return;
        }
        const result = await deleteMachine(machineId, () => {
            alert('Xoá máy giặt thành công!');
            window.location.reload(); // Reload page after successful deletion
        });

        if (!result.success) {
            alert(deleteerror || 'Có lỗi khi xoá máy giặt.');
        }
    };

    // Component xử lý tổng thời gian sử dụng của máy
    const MachineUsage = ({ machineId }) => {
        const { totalTime, loading, error } = useTotalUsageTime(machineId);

        // Tránh giật giật và hiển thị thông báo khi đang tải hoặc có lỗi
        if (loading) return <span>Đang tải...</span>;
        if (error) return <span>Lỗi: {error}</span>;

        return <span>{totalTime} giờ</span>;
    };

    // Xử lý chỉnh sửa tên máy
    const [editingNameId, setEditingNameId] = useState(null);
    const [nameEdit, setNameEdit] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { updateMachineName } = useUpdateMachineName();
    const handleEditClick = (id, currentName) => {
        setEditingNameId(id);
        setNameEdit(currentName);
        setIsModalOpen(true);
    };

    const handleSaveClick = async () => {
        if (editingNameId && nameEdit) {
            await updateMachineName(editingNameId, nameEdit);
            setIsModalOpen(false);
            window.location.reload(); // Refresh the page to update the list
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNameId(null);
    };

    // Refactor: Get the status of the machine from Firebase
    const getStatusText = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Sẵn sàng';
            case 'IN_USE':
                return 'Đang chạy';
            case 'MAINTENANCE':
                return 'Bảo trì';
            default:
                return 'Sẵn sàng'; // Trả về trạng thái mặc định nếu không khớp
        }
    };

    return (
        <div>
            <table className="machines-list-table">
                <thead>
                    <tr>
                        <th>Mã số máy</th>
                        <th>Tên Máy</th>
                        <th>Model</th>
                        <th>Dung tích</th>
                        <th>Trạng thái</th>
                        <th>Địa điểm</th>
                        <th>Tổng thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((data) => (
                        <tr key={data.id}>
                            <td>
                                {data.id}
                                <button
                                    onClick={() => handleDelete(data.id)}
                                    disabled={deleteloading}
                                    className="deleteMachineButton"
                                    style={{
                                        backgroundColor: '#fff',
                                        border: 0,
                                        float: 'right',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <CircleX size={20}/>
                                </button>
                            </td>
                            <td>
                                {data.name}
                                <button onClick={() => handleEditClick(data.id, data.name)}>
                                    <Pen size={18}/>
                                </button>
                            </td>
                            <td>{data.model}</td>
                            <td>{data.capacity} L</td>
                            <td>
                                <MachineStatus machineId={data.id} getStatusText={getStatusText} />
                            </td>
                            <td>
                                {data.locationName},<br /> {data.locationAddress}
                            </td>
                            <td>
                                <MachineUsage machineId={data.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Pop-up */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Sửa tên máy</h3>
                        <input
                            type="text"
                            value={nameEdit}
                            onChange={(e) => setNameEdit(e.target.value)}
                            style={{ width: '350px', marginBottom: '10px' }}
                        />
                        <div>
                            <button onClick={() => handleSaveClick(editingNameId)}>Lưu</button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        border: 0,
                        borderRadius: 10,
                        backgroundColor: '#fff',
                        padding: '5px 10px',
                    }}
                >
                    <ChevronLeft className="chevronStyle" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            border: 0,
                            backgroundColor: currentPage === index + 1 ? '#f0f0f0' : '#fff',
                            padding: '5px 10px',
                            borderRadius: 10,
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
                        backgroundColor: '#fff',
                        padding: '5px 10px',
                    }}
                >
                    <ChevronRight className="chevronStyle" />
                </button>
            </div>
        </div>
    );
}

// New component for displaying the machine status
const MachineStatus = ({ machineId, getStatusText }) => {
    const { status, loading, error } = useMachineStatus(machineId);

    if (loading) return <span>Đang tải...</span>;
    if (error) return <span>Lỗi: {error}</span>;

    return <span>{getStatusText(status)}</span>;
};

export default Machinepaginations;