import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Revenue from './pages/Revenue';
import Machine from './pages/Machine';
import User from './pages/User';
import Change from './pages/Change';
import Alert from './pages/Alert';
import TransactionsPage from './pages/Transactions';
import LoginPage from './pages/LoginPage/LoginPage';
import './App.css';
import Locations from './pages/Locations/locations';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra token trong localStorage khi khởi tạo ứng dụng
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Xóa token khỏi localStorage
    setIsLoggedIn(false);  // Đặt trạng thái đăng nhập thành false
  };

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  return (
    <div className="main">
      <Router>
        {isLoggedIn && <Sidebar />}
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/revenue"
              element={isLoggedIn ? <Revenue /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/machine-status"
              element={isLoggedIn ? <Machine /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/user-info"
              element={isLoggedIn ? <User /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/change"
              element={isLoggedIn ? <Change /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/alert"
              element={isLoggedIn ? <Alert /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/transactions"
              element={isLoggedIn ? <TransactionsPage /> : <LoginPage onLogin={handleLogin} />}
            />
               <Route
              path="/locations"
              element={isLoggedIn ? <Locations/> : <LoginPage onLogin={handleLogin} />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
