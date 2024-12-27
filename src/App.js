import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Revenue from "./pages/Revenue";
import Machine from "./pages/Machine";
import User from "./pages/User";
import Change from "./pages/Change";
import Alert from "./pages/Alert";
import TransactionsPage from "./pages/Transactions";
import OwnerWidthdraw from "./pages/OwnerWithdraw/OwnerWithdraw";
import LoginPage from "./pages/LoginPage/LoginPage";
import Locations from "./pages/Locations/locations";
import OwnerDetail from "./pages/OwnerDetail/OwnerDetail";
import LandingPage from "./LandingPage"; // Import LandingPage
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra token trong localStorage khi khởi tạo ứng dụng
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Xóa token khỏi localStorage
    setIsLoggedIn(false); // Đặt trạng thái đăng nhập thành false
  };

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  return (
    <div className="main">
      <Router>
        {isLoggedIn && <Sidebar />}
        <div className="content">
          <Routes>
            {/* Trang đầu tiên là LandingPage khi chưa đăng nhập */}
            <Route
              path="/landing-page"
              element={isLoggedIn ? <Dashboard /> : <LandingPage />}
            />
            {/* Các trang khác */}
            <Route
              path="/"
              element={
                isLoggedIn ? <Dashboard /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/revenue"
              element={
                isLoggedIn ? <Revenue /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/machine-status"
              element={
                isLoggedIn ? <Machine /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/user-info"
              element={
                isLoggedIn ? <User /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/change"
              element={
                isLoggedIn ? <Change /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/alert"
              element={
                isLoggedIn ? <Alert /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/transactions"
              element={
                isLoggedIn ? (
                  <TransactionsPage />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/locations"
              element={
                isLoggedIn ? <Locations /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/ownerwithdraw"
              element={
                isLoggedIn ? (
                  <OwnerWidthdraw />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/ownerdetail"
              element={
                isLoggedIn ? (
                  <OwnerDetail />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
