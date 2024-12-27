import React, { useState } from "react";
import NotificationIcons from "../../components/Notifications";
import Userpaginations from "../../components/Paginations/userPaginations";
import style from "./style.css";
import AddUserForm from "../../components/AddUsersComponents/AddUser"; // Import AddUserForm
import { Button, Box } from "@mui/material"; // Import MUI Button and Box

function User() {
  // State to manage the dialog visibility
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenAddUserDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenAddUserDialog(false);
  };

  return (
    <div className="user">
      <div className="header">
        <div className="reload">
          <NotificationIcons />
        </div>
      </div>
      <div className="user-table">
        <Userpaginations />
      </div>
    </div>
  );
}

export default User;
