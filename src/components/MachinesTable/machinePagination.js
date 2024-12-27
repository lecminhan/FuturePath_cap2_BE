import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Box,
  CircularProgress,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Stack,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Search } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Pen from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useMachineListTable from "../../hooks/useMachineListTable";
import useDeleteMachine from "../../hooks/useDeleteMachines";
import useUpdateMachineName from "../../hooks/useUpdateMachineName";
import useLocations from "../../hooks/useLocations";
import useFirebaseMachineStatus from "../../hooks/useFirebaseMachineStatus";
import useTotalUsageTime from "../../hooks/useTotalUsageTime";
import "./machinePaginations.css";

function Machinepaginations() {
  const {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  } = useMachineListTable();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);
  const prevFilteredMachinesRef = useRef([]);

  const { deleteMachine, deleteloading, deleteerror } = useDeleteMachine();
  const {
    updateMachine,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMachineName();
  const { locations } = useLocations();
  const firebaseStatus = useFirebaseMachineStatus(currentItems);

  const [editingMachineId, setEditingMachineId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDelete = async (machineId) => {
    if (deleteloading) return alert("Đang xoá máy, vui lòng đợi...");
    const result = await deleteMachine(machineId);
    if (!result.success) {
      setSnackbarMessage(deleteerror || "Có lỗi khi xoá máy giặt.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setSnackbarMessage("Xoá máy giặt thành công!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    window.location.reload();
  };

  const handleEditClick = (machine) => {
    setEditingMachineId(machine.id);
    setEditableData({ ...machine });
  };

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await updateMachine(editingMachineId, editableData);
      setSnackbarMessage("Cập nhật thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      setSnackbarMessage("Có lỗi khi cập nhật dữ liệu.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancelClick = () => {
    setEditingMachineId(null);
    setEditableData({});
  };

  const getStatusText = (status) => {
    const statusMap = {
      AVAILABLE: {
        text: "Sẵn sàng",
        color: "#03543F",
        backgroundColor: "#BCF0DA",
      },
      IN_USE: {
        text: "Đang chạy",
        color: "#0F327C",
        backgroundColor: "#CCE5FF",
      },
      UNDER_MAINTENANCE: {
        text: "Bảo trì",
        color: "#856404",
        backgroundColor: "#FFF3CD",
      },
      ERROR: { text: "Lỗi", color: "#9B2D3A", backgroundColor: "#FE876F" },
    };
    const statusData = statusMap[status] || statusMap["AVAILABLE"];
    return (
      <div
        className={`status-text status-${status.toLowerCase()}`}
        style={{
          backgroundColor: statusData.backgroundColor,
          color: statusData.color,
        }}
      >
        <span>{statusData.text}</span>
      </div>
    );
  };

  // Filter machines based on search query and status filter
  useEffect(() => {
    const updatedMachines = currentItems.map((machine) => ({
      ...machine,
      status:
        firebaseStatus.find((status) => status.secretId === machine.secretId)
          ?.status || "unknown",
    }));

    let filtered = updatedMachines;

    if (statusFilter) {
      filtered = filtered.filter((machine) => machine.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          machine.capacity.toString().includes(searchQuery)
      );
    }

    // Only update the filteredMachines state if it's different from the previous value
    if (
      JSON.stringify(filtered) !==
      JSON.stringify(prevFilteredMachinesRef.current)
    ) {
      setFilteredMachines(filtered);
      prevFilteredMachinesRef.current = filtered;
    }
  }, [statusFilter, searchQuery, currentItems, firebaseStatus]);

  const handleFilterChange = (e) => setStatusFilter(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  if (loading) {
    return (
      <Box
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={80} />
        <Typography variant="body1" sx={{ marginTop: 2, color: "#5B6C8F" }}>
          Đang tải dữ liệu, vui lòng chờ...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className="error-container"
        sx={{
          textAlign: "center",
          position: "absolute",
          right: 15,
          marginBottom: 2,
          bottom: 0,
        }}
      >
        <Alert severity="error">Không thể tải dữ liệu máy!</Alert>
      </Box>
    );
  }

  return (
    <Box className="machine-pagination-container">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        className="filter-options"
      >
        <FormControl fullWidth variant="outlined">
          <Select
            value={statusFilter || ""}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              marginBottom: 2,
              width: "50%",
              height: 40,
              backgroundColor: "#FFF",
            }}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
            <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
            <MenuItem value="UNDER_MAINTENANCE">Bảo trì</MenuItem>
            <MenuItem value="ERROR">Lỗi</MenuItem>
          </Select>
        </FormControl>

        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          label="Tìm kiếm máy"
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            width: "50%",
            height: 40,
            backgroundColor: "#FFF",
            borderRadius: 1,
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Stack>
      <Box className="data-grid-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DataGrid
            rows={filteredMachines}
            columns={[
              {
                field: "name",
                headerName: "Tên Máy",
                width: 170,
                renderCell: (params) =>
                  editingMachineId === params.row.id ? (
                    <TextField
                      defaultValue={editableData.name ?? params.row.name ?? ""}
                      onInput={(e) => handleInputChange("name", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === " ") e.stopPropagation();
                      }}
                      variant="standard" // Sử dụng kiểu 'standard' để ẩn border mặc định
                      size="small"
                      fullWidth
                      InputProps={{
                        disableUnderline: true, // Xóa gạch chân dưới input
                        style: { fontSize: "14px", padding: "4px 8px" }, // Tùy chỉnh padding
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          border: "none", // Xóa border input
                          backgroundColor: "transparent", // Nền trong suốt
                        },
                      }}
                    />
                  ) : (
                    <span>{params.row.name}</span>
                  ),
              },

              {
                field: "model",
                headerName: "Model",
                width: 100,
                renderCell: (params) =>
                  editingMachineId === params.row.id ? (
                    <TextField
                      defaultValue={
                        editableData.model ?? params.row.model ?? ""
                      }
                      onInput={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                      variant="standard"
                      size="small"
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        style: { fontSize: "14px", padding: "4px 8px" },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          border: "none",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  ) : (
                    params.row.model
                  ),
              },
              {
                field: "capacity",
                headerName: "Dung tích (L)",
                width: 110,
                renderCell: (params) =>
                  editingMachineId === params.row.id ? (
                    <TextField
                      defaultValue={
                        editableData.capacity ?? params.row.capacity ?? ""
                      }
                      onInput={(e) =>
                        handleInputChange("capacity", e.target.value)
                      }
                      variant="standard"
                      size="small"
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        style: { fontSize: "14px", padding: "4px 8px" },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          border: "none",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  ) : (
                    params.row.capacity
                  ),
              },
              {
                field: "status",
                headerName: "Trạng thái",
                width: 120,
                renderCell: (params) => (
                  <div className="status-text">
                    {getStatusText(params.row.status)}
                  </div>
                ),
              },
              {
                field: "locationName",
                headerName: "Địa điểm",
                width: 210,
                renderCell: (params) =>
                  editingMachineId === params.row.id ? (
                    <Select
                      value={editableData.locationId || ""}
                      onChange={(e) =>
                        handleInputChange("locationId", e.target.value)
                      }
                      sx={{ width: "200px", height: "42px" }}
                    >
                      {locations.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.name} - {loc.address}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    params.row.locationName
                  ),
              },
              {
                field: "usageTime",
                headerName: "Thời gian sử dụng (h)",
                width: 150,
                renderCell: (params) => (
                  <MachineUsage machineId={params.row.id} />
                ),
              },
              {
                field: "actions",
                headerName: "Hành động",
                width: 150,
                renderCell: (params) => (
                  <Box display="flex" alignItems="center">
                    {editingMachineId === params.row.id ? (
                      <div>
                        <Button
                          onClick={handleSaveClick}
                          sx={{ color: "#333333" }}
                        >
                          <SaveIcon />
                        </Button>
                        <Button
                          onClick={handleCancelClick}
                          sx={{ color: "#333333", fontSize: "14px" }}
                        >
                          <CloseIcon />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEditClick(params.row)}
                          sx={{ color: "#333333" }}
                        >
                          <Pen />
                        </Button>
                        <Button
                          onClick={() => handleDelete(params.row.id)}
                          sx={{ color: "#333333" }}
                        >
                          <DeleteIcon />
                        </Button>
                      </>
                    )}
                  </Box>
                ),
              },
            ]}
            loading={loading}
            rowsPerPageOptions={[7]} // Hiển thị tối đa 7 dòng trên mỗi trang
            pageSize={7} // Số dòng mặc định trên mỗi trang
            pagination
            page={currentPage - 1}
            onPageChange={(page) => handlePageChange(page + 1)}
            checkboxSelection
          />
        </motion.div>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const MachineUsage = ({ machineId }) => {
  const { totalTime, loading, error } = useTotalUsageTime(machineId);

  if (loading) {
    return (
      <Box display="flex" alignItems="center">
        <CircularProgress size={24} sx={{ marginRight: 1 }} />
        <Typography variant="body2">Đang tải...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Lỗi: {error}
      </Typography>
    );
  }

  return (
    <Typography variant="body2" color="textPrimary">
      {totalTime} giờ
    </Typography>
  );
};

export default Machinepaginations;
