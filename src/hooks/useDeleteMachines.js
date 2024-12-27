import { useState } from "react";
import axios from "axios";

function useDeleteMachine() {
  const [deleteloading, setDeleteLoading] = useState(false);
  const [deleteerror, setDeleteError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const deleteMachine = async (id, onSuccess) => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await axios.delete(`${API_HOST}/api/machines/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (onSuccess) onSuccess();
      window.location.reload(); // Trigger onSuccess callback if provided
      return { success: true, message: response.data.message };
    } catch (error) {
      setDeleteError("Có lỗi xảy ra khi xóa máy giặt");
      return { success: false, error: "Xóa máy giặt thất bại" };
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteMachine, deleteloading, deleteerror };
}

export default useDeleteMachine;
