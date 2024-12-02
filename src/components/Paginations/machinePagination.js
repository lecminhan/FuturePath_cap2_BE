import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CircleX,
  Pen,
  Check,
  X,
} from "lucide-react";
import useMachineListTable from "../../hooks/useMachineListTable";
import useDeleteMachine from "../../hooks/useDeleteMachines";
import useUpdateMachineName from "../../hooks/useUpdateMachineName";
import useLocations from "../../hooks/useLocations";
import useFirebaseMachineStatus from "../../hooks/useFirebaseMachineStatus";
import useTotalUsageTime from "../../hooks/useTotalUsageTime";
import useMachineStatus from "../../hooks/useMachineStatus";

function Machinepaginations() {
  const {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  } = useMachineListTable();
  const [statusFilter, setStatusFilter] = useState(""); // Selected status
  const [filteredMachines, setFilteredMachines] = useState([]); // Filtered machines list

  const { deleteMachine, deleteloading, deleteerror } = useDeleteMachine();
  const {
    updateMachine,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMachineName();
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useLocations();
  const firebaseStatus = useFirebaseMachineStatus(currentItems); // Firebase status data

  // Handle delete machine
  const handleDelete = async (machineId) => {
    if (deleteloading) return alert("Đang xoá máy, vui lòng đợi...");
    const result = await deleteMachine(machineId);
    if (!result.success)
      return alert(deleteerror || "Có lỗi khi xoá máy giặt.");
    alert("Xoá máy giặt thành công!");
    window.location.reload();
  };

  // State for editing machine
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [editableData, setEditableData] = useState({});

  // Handle edit click
  const handleEditClick = (machine) => {
    setEditingMachineId(machine.id);
    setEditableData({ ...machine });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes
  const handleSaveClick = async () => {
    try {
      await updateMachine(editingMachineId, editableData);
      alert("Cập nhật thành công!");
      setEditingMachineId(null);
      window.location.reload(); // Optional: Better to refetch data
    } catch (error) {
      alert("Có lỗi khi cập nhật dữ liệu.");
    }
  };

  // Cancel editing
  const handleCancelClick = () => {
    setEditingMachineId(null);
    setEditableData({});
  };

  // Get status text based on the status code
  const getStatusText = (status) => {
    const statusMap = {
      AVAILABLE: "Sẵn sàng",
      IN_USE: "Đang chạy",
      MAINTENANCE: "Bảo trì",
      ERROR: "Lỗi",
    };
    return statusMap[status] || "Sẵn sàng";
  };

  // Update machine status with firebase data
  useEffect(() => {
    if (currentItems.length > 0 && firebaseStatus.length > 0) {
      const combinedData = currentItems.map((machine) => {
        const status = firebaseStatus.find(
          (status) => status.machineId === machine.id
        );
        return { ...machine, status: status ? status.status : "unknown" };
      });
      setFilteredMachines(combinedData);
    }
  }, [currentItems, firebaseStatus]);

  // Filter machines by status
  useEffect(() => {
    if (statusFilter) {
      setFilteredMachines((prevMachines) =>
        prevMachines.filter((machine) => machine.status === statusFilter)
      );
    } else {
      setFilteredMachines(
        currentItems.map((machine) => ({
          ...machine,
          status:
            firebaseStatus.find((status) => status.machineId === machine.id)
              ?.status || "unknown",
        }))
      );
    }
  }, [statusFilter, currentItems, firebaseStatus]);

  const handleFilterChange = (e) => setStatusFilter(e.target.value);

  if (loading) return <p>Đang tải dữ liệu máy giặt...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <h2>Lọc trạng thái máy giặt</h2>
        <select onChange={handleFilterChange} value={statusFilter}>
          <option value="">Tất cả trạng thái</option>
          <option value="AVAILABLE">Sẵn sàng</option>
          <option value="IN_USE">Đang sử dụng</option>
          <option value="MAINTENANCE">Bảo trì</option>
          <option value="ERROR">Lỗi</option>
        </select>
      </div>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredMachines.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Không có máy giặt với trạng thái này.
              </td>
            </tr>
          ) : (
            filteredMachines.map((machine) => (
              <tr key={machine.id}>
                {editingMachineId === machine.id ? (
                  <>
                    <td>{machine.id}</td>
                    <td>
                      <input
                        style={{ width: "60px", fontSize: "14px" }}
                        type="text"
                        value={editableData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        style={{ width: "60px", fontSize: "14px" }}
                        type="text"
                        value={editableData.model}
                        onChange={(e) =>
                          handleInputChange("model", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editableData.capacity}
                        onChange={(e) =>
                          handleInputChange("capacity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <MachineStatus
                        machineId={machine.id}
                        getStatusText={getStatusText}
                      />
                    </td>
                    <td>
                      {locationsLoading ? (
                        <span>Đang tải danh sách địa điểm...</span>
                      ) : locationsError ? (
                        <span>Lỗi: {locationsError}</span>
                      ) : (
                        <select
                          style={{ width: "140px" }}
                          value={editableData.locationId || ""}
                          onChange={(e) =>
                            handleInputChange("locationId", e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Chọn địa điểm
                          </option>
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} ({loc.address})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <MachineUsage machineId={machine.id} />
                    </td>
                    <td>
                      <button
                        onClick={handleSaveClick}
                        disabled={updateLoading}
                      >
                        <Check size={18} /> Lưu
                      </button>
                      <button onClick={handleCancelClick}>
                        <X size={18} /> Hủy
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{machine.id}</td>
                    <td>{machine.name}</td>
                    <td>{machine.model}</td>
                    <td>{machine.capacity} L</td>
                    <td>
                      <MachineStatus
                        machineId={machine.id}
                        getStatusText={getStatusText}
                      />
                    </td>
                    <td>
                      {machine.locationName},<br />
                      {machine.locationAddress}
                    </td>
                    <td>
                      <MachineUsage machineId={machine.id} />
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(machine)}>
                        <Pen size={18} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(machine.id)}
                        disabled={deleteloading}
                        className="deleteMachineButton"
                      >
                        <CircleX size={18} /> Xóa
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

const Pagination = ({ currentPage, totalPages, handlePageChange }) => (
  <div className="pagination">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft />
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        style={{ fontWeight: currentPage === index + 1 ? "bold" : "normal" }}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <ChevronRight />
    </button>
  </div>
);

const MachineStatus = ({ machineId, getStatusText }) => {
  const { status, loading, error } = useMachineStatus(machineId);

  if (loading) return <span>Đang tải...</span>;
  if (error) return <span>Lỗi: {error}</span>;

  return <span>{getStatusText(status)}</span>;
};

const MachineUsage = ({ machineId }) => {
  const { totalTime, loading, error } = useTotalUsageTime(machineId);

  // Tránh giật giật và hiển thị thông báo khi đang tải hoặc có lỗi
  if (loading) return <span>Đang tải...</span>;
  if (error) return <span>Lỗi: {error}</span>;

  return <span>{totalTime} giờ</span>;
};

export default Machinepaginations;
