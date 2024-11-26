import { useCallback } from 'react';
import axios from 'axios';

const useUpdateWashingType = () => {
const API_HOST = process.env.REACT_APP_API_HOST;
const token = localStorage.getItem('authToken');
  const updateWashingType = useCallback(async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_HOST}/api/washing-types/${id}`, updatedData,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      return response.data;  // Returning the updated data in case you want to handle it
    } catch (error) {
      console.error('Error updating washing type:', error);
      throw error;  // Re-throw the error to handle it in the component if needed
    }
  }, []);

  return { updateWashingType };
};

export default useUpdateWashingType;
