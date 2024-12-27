import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import { AccountCircle, Edit } from "@mui/icons-material";
import NotificationIcons from "../../components/Notifications";
import "./style.css";

const API_HOST = process.env.REACT_APP_API_HOST;

function OwnerDetail() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("authToken");

  // Fetch user data and balance
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${API_HOST}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userResponse.data);

        const balanceResponse = await axios.get(
          `${API_HOST}/api/owners/withdraw/amount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const balance = parseFloat(balanceResponse.data);
        setAvailableBalance(balance);
        setWithdrawAmount(balance);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data or balance:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (!userData) {
    return (
      <Typography variant="h6" align="center">
        Không thể tải thông tin người dùng.
      </Typography>
    );
  }

  // Format balance
  const formatBalance = (balance) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(balance);

  // Handle withdraw dialog
  const handleWithdrawOpen = () => {
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawClose = () => {
    setWithdrawDialogOpen(false);
  };

  const handleWithdraw = () => {
    if (withdrawAmount < 1000000) {
      setSnackbarMessage("Số tiền rút phải trên 1 triệu.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const requestBody = {
      bankName: bank,
      accountNumber: accountNumber,
      accountName: userData.fullname,
      amount: withdrawAmount,
    };

    axios
      .patch(`${API_HOST}/api/owners/withdraw-info`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(
          "Withdrawal request submitted successfully:",
          response.data
        );

        // Send POST request to withdraw API
        const withdrawRequestBody = {
          amount: withdrawAmount,
        };
        axios
          .post(`${API_HOST}/api/owners/withdraw`, withdrawRequestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((withdrawResponse) => {
            console.log(
              "Withdrawal amount submitted successfully:",
              withdrawResponse.data
            );
            setWithdrawDialogOpen(false);
            setSnackbarMessage("Yêu cầu rút tiền đã được gửi thành công.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          })
          .catch((withdrawError) => {
            console.error("Error processing withdrawal amount:", withdrawError);
            setSnackbarMessage("Có lỗi xảy ra khi gửi yêu cầu rút tiền.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          });
      })
      .catch((error) => {
        console.error("Error processing withdrawal:", error);
        setSnackbarMessage("Có lỗi xảy ra khi gửi yêu cầu rút tiền.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  return (
    <div className="ownerdetail">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>

      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Card
            sx={{
              maxWidth: 800,
              margin: "20px auto",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Grid
                container
                alignItems="center"
                spacing={2}
                sx={{ marginBottom: 3 }}
              >
                <Grid item>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 70, height: 70 }}>
                    <AccountCircle fontSize="large" />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h5" fontWeight="bold">
                    Thông tin cá nhân
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Quản lý thông tin cá nhân và tài khoản
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ marginBottom: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Họ và tên:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{userData.fullname}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{userData.email}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Số điện thoại:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{userData.phone}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Số dư tài khoản:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    {formatBalance(availableBalance)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleWithdrawOpen}
                  >
                    Rút tiền
                  </Button>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Vai trò:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    Chủ hệ thống máy giặt chi nhánh {userData.id}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ marginTop: 3 }} />

              <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                >
                  Cập nhật thông tin
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Dialog
          open={withdrawDialogOpen}
          onClose={handleWithdrawClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            Rút tiền về tài khoản ngân hàng
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên người rút"
                  value={userData.fullname}
                  InputProps={{ readOnly: true }}
                  sx={{ marginTop: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số tài khoản"
                  placeholder="Nhập số tài khoản"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? selected : "Chọn ngân hàng"
                  }
                >
                  <MenuItem value="">Chọn ngân hàng</MenuItem>
                  <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                  <MenuItem value="Techcombank">Techcombank</MenuItem>
                  <MenuItem value="BIDV">BIDV</MenuItem>
                  <MenuItem value="Agribank">Agribank</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số tiền cần rút"
                  type="number"
                  value={withdrawAmount}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Khả dụng: {formatBalance(availableBalance)}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              <ul>
                <li>Một tháng rút vào ngày 10 đến 15</li>
                <li>Số tiền rút ít nhất là 1.000.000</li>
                <li>Thời gian xử lý yêu cầu là 72h</li>
                <li>Mọi thắc mắc xin liên hệ...</li>
              </ul>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWithdrawClose} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleWithdraw} color="primary">
              Rút tiền
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
}

export default OwnerDetail;
