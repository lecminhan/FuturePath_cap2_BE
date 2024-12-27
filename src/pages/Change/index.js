import React, { useState, useEffect } from "react";
import NotificationIcons from "../../components/Notifications";
import useFetchWashingTypes from "../../hooks/useFetchWashingTypes";
import useUpdateWashingType from "../../hooks/useUpdateWashingType";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Save, Edit, Cancel } from "@mui/icons-material";
import { Delete, Search } from "@mui/icons-material";
import {
  CircularProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
  TextField,
  IconButton,
} from "@mui/material";
import "./change.css";

function Change() {
  const { data, loading, error } = useFetchWashingTypes();
  const { updateWashingType } = useUpdateWashingType();
  const [editRows, setEditRows] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [roleName, setRoleName] = useState(
    localStorage.getItem("roleName") || ""
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((item) =>
          item.typeName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [data, searchQuery]);

  const handleEditClick = (id) => {
    setEditRows((prev) => ({ ...prev, [id]: true }));
  };

  const handleCancelClick = (id) => {
    setEditRows((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSave = async (id) => {
    const updatedRow = editRows[id];
    if (updatedRow) {
      setIsSaving(true);
      const originalData = data.find((row) => row.id === id);
      const updatedData = {
        id,
        typeName: updatedRow.typeName || originalData.typeName,
        defaultDuration:
          updatedRow.defaultDuration || originalData.defaultDuration,
        defaultPrice: updatedRow.defaultPrice || originalData.defaultPrice,
      };

      try {
        await updateWashingType(id, updatedData);
        setSnackbarMessage("Cập nhật thành công");
        setOpenSnackbar(true);
        handleCancelClick(id);
      } catch (error) {
        setSnackbarMessage("Có lỗi khi cập nhật");
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID Loại",
      width: 100,
      sx: { textAlign: "center" },
    },
    {
      field: "typeName",
      headerName: "Tên Loại",
      flex: 1,
      renderCell: (params) => {
        const isEditing = !!editRows[params.id];
        return isEditing ? (
          <input
            type="text"
            defaultValue={editRows[params.id]?.typeName ?? params.value ?? ""}
            onInput={(e) => {
              const newValue = e.target.value;
              setEditRows((prev) => ({
                ...prev,
                [params.id]: {
                  ...prev[params.id],
                  typeName: newValue,
                },
              }));
            }}
            onKeyDown={(e) => {
              if (e.key === " ") e.stopPropagation();
            }}
            className="input-field"
          />
        ) : (
          <span>{params.value}</span>
        );
      },
    },
    {
      field: "defaultDuration",
      headerName: "Thời Gian Mặc Định (phút)",
      flex: 1,
      renderCell: (params) => {
        const isEditing = !!editRows[params.id];
        return isEditing ? (
          <input
            type="text"
            defaultValue={
              editRows[params.id]?.defaultDuration ?? params.value ?? ""
            }
            onInput={(e) => {
              const newValue = e.target.value;
              if (!isNaN(newValue) && Number(newValue) <= 100) {
                setEditRows((prev) => ({
                  ...prev,
                  [params.id]: {
                    ...prev[params.id],
                    defaultDuration: newValue,
                  },
                }));
              } else if (isNaN(newValue)) {
                setSnackbarMessage("Vui lòng nhập số hợp lệ");
                setOpenSnackbar(true);
              } else {
                setSnackbarMessage("Không thể đặt thời gian hơn 100 phút");
                setOpenSnackbar(true);
              }
            }}
            className="input-field"
          />
        ) : (
          <span>{params.value}</span>
        );
      },
    },
    {
      field: "defaultPrice",
      headerName: "Giá Mặc Định (VND)",
      flex: 1,
      renderCell: (params) => {
        const isEditing = !!editRows[params.id];
        return isEditing ? (
          <input
            type="text"
            defaultValue={
              editRows[params.id]?.defaultPrice ?? params.value ?? ""
            }
            onInput={(e) => {
              const newValue = e.target.value;
              if (!isNaN(newValue)) {
                setEditRows((prev) => ({
                  ...prev,
                  [params.id]: {
                    ...prev[params.id],
                    defaultPrice: newValue,
                  },
                }));
              } else {
                setSnackbarMessage("Vui lòng nhập số hợp lệ");
                setOpenSnackbar(true);
              }
            }}
            className="input-field"
          />
        ) : (
          <span>{params.value}</span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành Động",
      type: "actions",
      width: 150,
      getActions: (params) => {
        const isEditing = !!editRows[params.id];
        return isEditing
          ? [
              <GridActionsCellItem
                icon={<Save />}
                label="Lưu"
                onClick={() => handleSave(params.id)}
                disabled={isSaving}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Hủy"
                onClick={() => handleCancelClick(params.id)}
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<Edit />}
                label="Sửa"
                onClick={() => handleEditClick(params.id)}
              />,
            ];
      },
    },
  ];

  if (loading)
    return (
      <div
        className="change"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <div className="change">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>

      <div className="search-bar" style={{ paddingBottom: "1rem" }}>
        <TextField
          label="Tìm kiếm loại giặt"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            marginLeft: 3,
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

      <div
        className="change-table-container"
        sx={{ height: 400, width: "95%" }}
      >
        <DataGrid rows={filteredData} columns={columns} autoHeight />
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={
            snackbarMessage.includes("Cập nhật thành công")
              ? "success"
              : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Change;
