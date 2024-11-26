import { useState, useEffect } from 'react';
import axios from 'axios'; // Directly using axios for data fetching

const useTransactions = () => {
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [transactions, setTransactions] = useState([]); // To store transaction data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const itemsPerPage = 6; // Number of items per page
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_HOST}/api/transactions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(response.data); // Set transactions data
            } catch (err) {
                setError('Failed to fetch transactions'); // Handle error
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchTransactions(); // Fetch transaction data when component mounts
    }, [token]); // Re-fetch if token changes

    // Calculate data for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = transactions.slice(startIndex, startIndex + itemsPerPage);

    // Total pages calculation
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => setCurrentPage(page);

    return {
        currentItems,
        currentPage,
        totalPages,
        loading,
        error,
        handlePageChange,
    };
};

export default useTransactions;
