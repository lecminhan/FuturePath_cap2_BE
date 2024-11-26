import { useState } from 'react';
import axios from 'axios';

const useUpdateMachineName = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_HOST = process.env.REACT_APP_API_HOST;
    const token = localStorage.getItem('authToken');
    const updateMachineName = async (id, nameEdit) => {
        setLoading(true);
        setError(null);

        const headers = {
            Authorization: `Bearer ${token}`, // Add the token here
        };
        try {
            const response = await axios.put(
                `${API_HOST}/api/machines/${id}`,
                {
                    name: nameEdit,
                    model: 'WX-4500',
                    capacity: 15,
                    status: 'AVAILABLE',
                    locationId: 2,
                },
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

    return { updateMachineName, loading, error };
};

export default useUpdateMachineName;
