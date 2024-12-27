import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationIcons from "../../components/Notifications";
const API_HOST = process.env.REACT_APP_API_HOST;
const token = localStorage.getItem("authToken");
function OwnerWithdraw() {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get(`${API_HOST}/api/transactions/type/withdrawal/status/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Kiểm tra dữ liệu
        setWithdrawRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching withdrawal requests:", error);
      });
  }, []);

  const handleApprove = (id) => {
    axios
      .put(`${API_HOST}/api/owners/withdraw/confirm/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setWithdrawRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "Approved" } : req
          )
        );
        setSnackbar({
          open: true,
          message: "Yêu cầu đã được chấp nhận!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error("Error approving withdrawal request:", error);
      });
  };

  const handleReject = () => {
    axios
      .put(
        `${API_HOST}/api/owners/withdraw/cancel/${selectedRequestId}`,
        {
          reason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setWithdrawRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequestId ? { ...req, status: "Rejected" } : req
          )
        );
        setSnackbar({
          open: true,
          message: "Yêu cầu đã bị từ chối!",
          severity: "error",
        });
        setRejectDialogOpen(false);
        setRejectReason("");
      })
      .catch((error) => {
        console.error("Error rejecting withdrawal request:", error);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredRequests = withdrawRequests.filter(
    (req) =>
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.accountNumber?.includes(searchQuery)
  );

  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "userName", headerName: "Tên chủ sở hữu", width: 200 },
    {
      field: "amount",
      headerName: "Số tiền (VND)",
      width: 150,
      renderCell: (params) => (
        <Typography>{params.value.toLocaleString()}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: "bold",
            color:
              params.value === "Approved"
                ? "green"
                : params.value === "Rejected"
                ? "red"
                : params.value === "PENDING"
                ? "orange"
                : "default",
          }}
        >
          {params.value === "PENDING" ? "Đang chờ" : params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Loại giao dịch",
      width: 150,
      renderCell: (params) => (
        <Typography>
          {params.value === "WITHDRAWAL" ? "Rút tiền" : params.value}
        </Typography>
      ),
    },
    {
      field: "userId",
      headerName: "ID người dùng",
      width: 150,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 250,
      renderCell: (params) =>
        params.row.status === "PENDING" && (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleApprove(params.row.id)}
              size="small"
            >
              Chấp nhận
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setSelectedRequestId(params.row.id);
                setRejectDialogOpen(true);
              }}
              size="small"
            >
              Từ chối
            </Button>
          </Box>
        ),
    },
  ];

  return (
    <div className="ownerwithdraw">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>

      <Card
        sx={{
          margin: "20px auto",
          padding: "20px",
          maxWidth: "900px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          {/* Header */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quản lý yêu cầu rút tiền
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          {/* Thanh Tìm Kiếm */}
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Nhập tên, số tài khoản hoặc ngân hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                "& .MuiInputBase-input": {
                  padding: "10px",
                },
              }}
            />
          </Box>

          {/* DataGrid */}
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
              padding: 2,
            }}
          >
            <DataGrid
              rows={filteredRequests}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              autoHeight
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: "14px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Lý do từ chối</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            type="text"
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleReject} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OwnerWithdraw;
