import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { LinearProgress, Alert, TextField, IconButton } from "@mui/material";
import { Search } from "lucide-react";
import useMachineIncomeList from "../../hooks/useMachineIncomeList";
import useMachineIncome from "../../hooks/useMachineIncome";

function Rmachinepaginations() {
  const {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  } = useMachineIncomeList();

  const {
    incomeByMachine,
    loading: incomeLoading,
    error: incomeError,
  } = useMachineIncome();

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(currentItems);

  useEffect(() => {
    // Filter items based on the search term
    if (searchTerm) {
      setFilteredItems(
        currentItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredItems(currentItems);
    }
  }, [searchTerm, currentItems]);

  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Tên Máy", width: 180 },
    { field: "location", headerName: "Địa điểm", width: 250 },
    { field: "income", headerName: "Thu nhập", width: 100 },
  ];

  // Process rows with income data
  const rows = filteredItems.map((data) => ({
    id: data.id,
    name: data.name,
    location: data.locationName,
    income: incomeByMachine[data.id]?.totalIncome || 0,
  }));

  return (
    <div className="machine-table-container">
      <Box sx={{ height: 400, width: "100%" }}>
        {/* Loading Indicator */}
        {(loading || incomeLoading) && (
          <Box sx={{ width: "100%", marginBottom: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Error Message */}
        {(error || incomeError) && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error || incomeError}
          </Alert>
        )}

        {/* Search Field */}
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            marginBottom: 2,
            width: "100%",
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

        {/* Data Grid */}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={6}
          pagination
          page={currentPage - 1}
          onPageChange={(newPage) => handlePageChange(newPage + 1)}
          autoHeight
          checkboxSelection
          disableSelectionOnClick
          paginationMode="client" // Phân trang phía client
        />
      </Box>
    </div>
  );
}

export default Rmachinepaginations;
