// useLogin.js
import { useState } from 'react';
import axios from 'axios';

const useLogin = (onLogin) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const API_HOST = process.env.REACT_APP_API_HOST;
    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post(`${API_HOST}/api/auth/login`, {
                usernameOrEmail,
                password
            });

            if (response.data.accessToken) {
                localStorage.setItem('authToken', response.data.accessToken);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('tokenType', response.data.tokenType);

                onLogin(response.data.accessToken);
            }
        } catch (error) {
            setErrorMessage('Lỗi đăng nhập, vui lòng thử lại');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        usernameOrEmail,
        setUsernameOrEmail,
        password,
        setPassword,
        errorMessage,
        isLoading,
        handleLogin,
    };
};

export default useLogin;
