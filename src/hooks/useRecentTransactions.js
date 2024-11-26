import { useState, useEffect } from 'react';
import axios from 'axios';

const useRecentTransactions = () => {
    const [userTransactions, setUserTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true); // Start loading state
                const response = await axios.get(`${API_HOST}/api/transactions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Get only the first 4 transactions
                setUserTransactions(response.data.slice(0, 4));
            } catch (err) {
                setError('Failed to fetch data'); // Set error if request fails
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchTransactions(); // Call the function to fetch data
    }, [token]); // Run once when the component mounts or token changes

    return { userTransactions, loading, error };
};

export default useRecentTransactions;
