import { useState } from "react";
import axios from "axios";

const useUpdateMachineName = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");

  const updateMachine = async (id, updatedFields) => {
    setLoading(true);
    setError(null);

    const headers = {
      Authorization: `Bearer ${token}`, // Add the token here
    };

    try {
      const response = await axios.put(
        `${API_HOST}/api/machines/${id}`,
        updatedFields, // Pass the updated fields directly
        { headers }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  };

  return { updateMachine, loading, error };
};

export default useUpdateMachineName;
