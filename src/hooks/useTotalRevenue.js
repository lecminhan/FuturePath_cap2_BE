import { useState, useEffect } from 'react';
import axios from 'axios';

const useTotalRevenue = (selectedDate) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem('authToken');
  
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_HOST}/api/usage-histories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter data by the selected date
        const filteredData = response.data.filter(item => {
          const usageDate = new Date(item.startTime); // Assuming startTime is a timestamp or a valid date
          return (
            usageDate.toDateString() === new Date(selectedDate).toDateString()
          );
        });

        // Calculate total revenue for the selected date
        const revenue = filteredData
          ? filteredData.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0).toFixed(0)
          : 0;
        
        setTotalRevenue(revenue); // Update total revenue
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [selectedDate, token]); // Run when selectedDate or token changes

  return { totalRevenue, loading, error };
};

export default useTotalRevenue;
