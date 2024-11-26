import { useEffect, useState } from 'react';
import axios from 'axios';
import { generateChartData, generateTimeChartData, generateCostChartData } from '../Services/ChartService';

const useChartData = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_HOST}/api/usage-histories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;
                // Generate chart data once the data is fetched
                const combinedChartData = generateChartData(data);
                const timeChartData = generateTimeChartData(data);
                const costChartData = generateCostChartData(data);

                setChartData({ combinedChartData, timeChartData, costChartData });
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Trigger the API call

    }, [token]); // Re-fetch if token changes (optional)

    return { chartData, loading, error };
};

export default useChartData;
