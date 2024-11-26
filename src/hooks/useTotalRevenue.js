import { useState, useEffect } from 'react';
import axios from 'axios';

const useTotalRevenue = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`${API_HOST}/api/usage-histories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Calculate total revenue
                const revenue = response.data
                    ? response.data.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0).toFixed(2)
                    : 0;
                
                setTotalRevenue(revenue); // Update the state with the total revenue
            } catch (err) {
                setError('Failed to fetch data'); // Handle error
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchRevenue(); // Call the function to fetch revenue data
    }, [token]); // Run the effect when the component mounts or token changes

    return { totalRevenue, loading, error }; // Return total revenue, loading, and error
};

export default useTotalRevenue;
