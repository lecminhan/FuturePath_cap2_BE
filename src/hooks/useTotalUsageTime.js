import { useState, useEffect } from 'react';
import axios from 'axios'; // Directly using axios instead of useApi for simplicity

const useTotalUsageTime = (machineId) => {
    const [totalTime, setTotalTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading state
                const response = await axios.get(`${API_HOST}/api/usage-histories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const usageData = response.data;

                // Calculate total time for the specific machine
                let total = 0;
                usageData.forEach((usage) => {
                    if (usage.machineId === machineId) {
                        const [startYear, startMonth, startDay, startHour, startMinute] = usage.startTime;
                        const [endYear, endMonth, endDay, endHour, endMinute] = usage.endTime;

                        // Convert startTime and endTime into Date objects
                        const startTime = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
                        const endTime = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

                        // Calculate the difference in hours and add to total time
                        const timeDifference = (endTime - startTime) / (1000 * 60 * 60); // in hours
                        total += timeDifference;
                    }
                });

                setTotalTime(total); // Update total time state
            } catch (err) {
                setError('Failed to fetch data'); // Handle any errors
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData(); // Fetch the data and calculate the total time for the specified machine
    }, [machineId, token]); // Re-fetch when machineId or token changes

    return { totalTime, loading, error };
};

export default useTotalUsageTime;
