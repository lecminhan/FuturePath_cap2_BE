// LoginPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin'; // Import custom hook
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const {
        usernameOrEmail,
        setUsernameOrEmail,
        password,
        setPassword,
        errorMessage,
        isLoading,
        handleLogin
    } = useLogin(onLogin);  // Sử dụng custom hook

    return (
        <div className="login-page">
            <h2 className="login-title">Đăng Nhập</h2>
            <form onSubmit={(event) => { handleLogin(event); navigate('/'); }} className="login-form">
                <div className="input-group">
                    <label>Username hoặc Email</label>
                    <input
                        type="text"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='login-button' type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default LoginPage;
