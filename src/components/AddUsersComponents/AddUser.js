import React, { useState } from "react";
import useAddUserForm from "../../hooks/useAddUsers";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"; // Đảm bảo import các component MUI cần thiết
import { X } from "lucide-react";

const AddUserForm = ({ onClose }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { formData, handleChange, handleSubmit } = useAddUserForm(
    onClose,
    setSnackbar
  );

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            paddingBottom: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Thêm Người Dùng
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Form Content */}
      <DialogContent
        sx={{
          paddingTop: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Tên người dùng"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <TextField
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <TextField
              label="Họ tên"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <TextField
              label="Điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: "bold" },
              }}
            />

            <Box
              display="flex"
              justifyContent="flex-end"
              gap={2}
              alignItems="center"
              sx={{ marginTop: 3 }}
            >
              {/* Hiển thị loading khi đang xử lý */}
              {snackbar.severity === "info" && <CircularProgress size={24} />}
              <Button
                onClick={onClose}
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Thêm người dùng
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddUserForm;
