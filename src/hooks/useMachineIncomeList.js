import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

const useMachineIncomeList = () => {
    const [data, setData] = useState(null); // Store API data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const itemsPerPage = 6; // Items per page
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    // Fetch the data when the component mounts or the currentPage changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_HOST}/api/machines`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setData(response.data);
            } catch (error) {
                setError(error.message || 'Something went wrong!');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]); // Re-fetch data when currentPage changes

    // Calculate the data for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data ? data.slice(startIndex, startIndex + itemsPerPage) : [];

    // Total number of pages
    const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

    const handlePageChange = (page) => setCurrentPage(page);

    return {
        data,
        currentItems,
        currentPage,
        totalPages,
        loading,
        error,
        handlePageChange,
    };
};

export default useMachineIncomeList;
