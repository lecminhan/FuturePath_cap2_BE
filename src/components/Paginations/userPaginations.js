import React, { useState } from "react";
import { UserPlus, Trash2, Search } from "lucide-react";
import { Edit, Delete, Upgrade } from "@mui/icons-material";
import axios from "axios";
import useUserList from "../../hooks/useUserList";
import "./style.css";
import AddUserForm from "../AddUsersComponents/AddUser";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const API_BASE_URL = "https://laundry.mrthinkj.site/api";

function Userpaginations() {
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openUpdateOwnerDialog, setOpenUpdateOwnerDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const { currentItems, loading, error } = useUserList();
  const token = localStorage.getItem("authToken");

  const handleOpenDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleOpenUpdateOwnerDialog = (user) => {
    setSelectedUser(user);
    setOpenUpdateOwnerDialog(true);
  };

  const handleCloseUpdateOwnerDialog = () => {
    setOpenUpdateOwnerDialog(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage("Cập nhật thành công!");
      setAlertSeverity("success");
      setOpenAlert(true);
    } catch (error) {
      console.error("Error updating user:", error);
      setAlertMessage("Cập nhật thất bại!");
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage("Xóa người dùng thành công!");
      setAlertSeverity("success");
      setOpenAlert(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setAlertMessage("Xóa người dùng thất bại!");
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const handleUpgradeUser = async (username) => {
    try {
      await axios.put(`${API_BASE_URL}/owners/update/${username}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage("Cập nhật quyền chủ sở hữu thành công!");
      setAlertSeverity("success");
      setOpenAlert(true);
      handleCloseUpdateOwnerDialog();
    } catch (error) {
      console.error("Error updating owner:", error);
      setAlertMessage("Có lỗi xảy ra khi cập nhật quyền chủ sở hữu.");
      setAlertSeverity("error");
      setOpenAlert(true);
    }
  };

  const filteredItems = currentItems.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const roleName = localStorage.getItem("roleName");

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Tên người dùng", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 160 },
    { field: "balance", headerName: "Số dư", width: 130 },
    ...(roleName === "ROLE_ADMIN"
      ? [
          {
            field: "action",
            headerName: "Hành động",
            width: 150,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Delete
                  size={24}
                  style={{ cursor: "pointer", color: "#707070" }}
                  onClick={() => handleDeleteUser(params.row.id)}
                />
                <Upgrade
                  size={24}
                  style={{ cursor: "pointer", color: "#707070" }}
                  onClick={() => handleOpenUpdateOwnerDialog(params.row)}
                />
              </Box>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div
        className="userlist"
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
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Alert
          severity="error"
          sx={{
            textAlign: "center",
            position: "absolute",
            right: 15,
            marginBottom: 2,
            bottom: 0,
          }}
        >
          Không thể tải dữ liệu người dùng!
        </Alert>
      </div>
    );
  }

  return (
    <div className="userlist">
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          fullWidth
          size="small"
          sx={{
            marginBottom: 1,
            width: "40%",
            backgroundColor: "#fff",
            "& .MuiInputBase-root": {
              height: 40,
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
          rows={filteredItems}
          columns={columns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
        <Button
          sx={{ marginTop: 1 }}
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Thêm Người Dùng
        </Button>

        {openAddUserDialog && <AddUserForm onClose={handleCloseDialog} />}
      </div>

      <Dialog
        open={openUpdateOwnerDialog}
        onClose={handleCloseUpdateOwnerDialog}
      >
        <DialogTitle>Cập nhật quyền chủ sở hữu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên người dùng"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedUser?.username || ""}
            onChange={(e) => setUsername(e.target.value)}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateOwnerDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={() => handleUpgradeUser(selectedUser.username)}
            variant="contained"
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Userpaginations;
