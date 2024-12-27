import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid từ MUI
import useTransactions from "../../hooks/useTransactions"; // Import hook

function TransactionPaginations() {
  const { currentItems, loading, error } = useTransactions(); // Gọi hook để lấy dữ liệu
  const [searchQuery, setSearchQuery] = useState("");

  // Function to format date/time
  const formatDate = ([year, month, day, hour, minute, second]) => {
    const date = new Date(year, month - 1, day, hour, minute, second);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);
  };

  // Function to handle search input
  const handleSearch = (e) => setSearchQuery(e.target.value);

  // Filter rows based on search query
  const filteredRows = currentItems.filter((item) =>
    item.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "transaction", headerName: "Giao dịch", width: 170 },
    { field: "dateTime", headerName: "Ngày & Giờ", width: 280 },
    { field: "cost", headerName: "Số tiền", width: 100 },
    { field: "washingType", headerName: "Loại giặt", width: 220 },
    { field: "machine", headerName: "Máy giặt", width: 200 },
  ];

  // Prepare rows data with sequential ID
  const rows = filteredRows.map((item, index) => ({
    id: index + 1,
    transaction: `Giao dịch từ ${item.userName}`,
    dateTime: Array.isArray(item.startTime)
      ? formatDate(item.startTime)
      : "Không có dữ liệu",
    cost: item.cost,
    washingType: item.washingTypeName,
    machine: item.machineName,
  }));

  // Hiển thị loading ở giữa màn hình
  if (loading) {
    return (
      <div
        className="transactions-list"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} />
        <Typography
          variant="body1"
          style={{ marginTop: "10px", color: "#555" }}
        >
          Đang tải dữ liệu giao dịch...
        </Typography>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="transactions-list">
        <Alert severity="error">Có lỗi xảy ra: {error}</Alert>
      </div>
    );
  }

  return (
    <div className="transactions-list">
      {/* Search Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Tìm kiếm giao dịch"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
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
      </Box>

      {/* DataGrid Component */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
}

export default TransactionPaginations;
