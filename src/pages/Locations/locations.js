import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import NotificationIcons from "../../components/Notifications";
import "./locations.css";

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationData, setLocationData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    lat: "",
    lng: "",
  });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Get roleName from localStorage
  const API_HOST = process.env.REACT_APP_API_HOST;

  // Fetch all locations
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_HOST}/api/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setLocations(response.data);
      setError("");
    } catch (err) {
      setError("Không thể tải danh sách địa điểm.");
    } finally {
      setLoading(false);
    }
  };

  // Add or Update location
  const saveLocation = async () => {
    setLoading(true);
    try {
      if (editingLocationId) {
        await axios.put(
          `${API_HOST}/api/locations/${editingLocationId}`,
          locationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
      } else {
        await axios.post(`${API_HOST}/api/locations`, locationData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
      }
      fetchLocations();
      resetForm();
      setOpenDialog(false);
      setSnackbarMessage("Cập nhật địa điểm thành công!");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Không thể lưu địa điểm.");
      setSnackbarMessage("Đã xảy ra lỗi khi lưu địa điểm!");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Delete location
  const deleteLocation = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_HOST}/api/locations/${deleteLocationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      fetchLocations();
      setSnackbarMessage("Xóa địa điểm thành công!");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    } catch (err) {
      setSnackbarMessage("Đã xảy ra lỗi khi xóa địa điểm!");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingLocationId(null);
    setLocationData({
      name: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      lat: "",
      lng: "",
    });
  };

  // Handle open/close dialog
  const openEditDialog = (location) => {
    setEditingLocationId(location.id);
    setLocationData(location);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const openDeleteConfirmationDialog = (id) => {
    setDeleteLocationId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteLocationId(null);
    setOpenDeleteDialog(false);
  };

  // Handle search query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchLocations();
  }, []);

  const columns = [
    { field: "name", headerName: "Tên", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 1 },
    { field: "city", headerName: "Thành phố", flex: 1 },
    { field: "district", headerName: "Quận", flex: 1 },
    { field: "ward", headerName: "Phường", flex: 1 },
    ...(roleName !== "ROLE_ADMIN"
      ? [
          {
            field: "actions",
            headerName: "Hành động",
            flex: 1,
            renderCell: (params) => (
              <>
                <IconButton
                  color="#707070"
                  onClick={() => openEditDialog(params.row)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="#707070"
                  onClick={() => openDeleteConfirmationDialog(params.row.id)}
                >
                  <Delete />
                </IconButton>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="locations">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>
      <div className="location-manager-container">
        {loading && (
          <div className="loading-text">
            <CircularProgress size={24} /> Đang tải dữ liệu...
          </div>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Search bar */}
        <div style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            label="Tìm kiếm địa điểm"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            sx={{
              marginBottom: 2,
              width: "40%",
              backgroundColor: "#fff",
              "& .MuiInputBase-root": {
                height: 40, // Điều chỉnh chiều cao cụ thể
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <Search />
                </IconButton>
              ),
            }}
          />
        </div>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredLocations}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            loading={loading}
            autoHeight
          />
        </div>

        {/* Button to Add Location */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Thêm địa điểm
          </Button>
        </div>

        {/* Dialog for Add/Edit Location */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingLocationId ? "Sửa địa điểm" : "Thêm địa điểm"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Tên địa điểm"
              value={locationData.name}
              onChange={(e) =>
                setLocationData({ ...locationData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Địa chỉ"
              value={locationData.address}
              onChange={(e) =>
                setLocationData({ ...locationData, address: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Thành phố"
              value={locationData.city}
              onChange={(e) =>
                setLocationData({ ...locationData, city: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quận"
              value={locationData.district}
              onChange={(e) =>
                setLocationData({ ...locationData, district: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phường"
              value={locationData.ward}
              onChange={(e) =>
                setLocationData({ ...locationData, ward: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Kinh độ"
              value={locationData.lng}
              onChange={(e) =>
                setLocationData({ ...locationData, lng: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Vĩ độ"
              value={locationData.lat}
              onChange={(e) =>
                setLocationData({ ...locationData, lat: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Hủy
            </Button>
            <Button onClick={saveLocation} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Delete Confirmation */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa địa điểm này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={deleteLocation}
              color="primary"
              variant="contained"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default LocationManager;
