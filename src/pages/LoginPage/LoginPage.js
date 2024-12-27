import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  Link,
} from "@mui/material";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const {
    usernameOrEmail,
    setUsernameOrEmail,
    password,
    setPassword,
    errorMessage,
    isLoading,
    handleLogin,
  } = useLogin(onLogin);

  const [fieldErrors, setFieldErrors] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const validateFields = () => {
    const errors = {};
    if (!usernameOrEmail.trim()) errors.usernameOrEmail = "Không được để trống";
    if (!password.trim()) errors.password = "Không được để trống";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateFields()) return;
    handleLogin(event);
    navigate("/");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #f7f8fa, #eaeef2)",
        padding: 2,
      }}
    >
      {/* Form đăng nhập */}
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            fontWeight: "bold",
            background: "linear-gradient(to right, #10a37f, #2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Chào mừng trở lại
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email hoặc Username"
            variant="outlined"
            fullWidth
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.usernameOrEmail}
            helperText={fieldErrors.usernameOrEmail}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              marginBottom: 2,
              height: 50,
              background: "#10a37f",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                background: "#0e8c6a",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Đăng nhập"
            )}
          </Button>

          <Button
            onClick={handleForgotPassword}
            variant="text"
            fullWidth
            sx={{
              color: "#10a37f",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Quên mật khẩu?
          </Button>
        </form>

        {errorMessage && (
          <Typography
            variant="body2"
            color="error"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        )}
      </Card>

      {/* Footer */}
      <Typography
        variant="body2"
        sx={{
          marginTop: 3,
          color: "#6c757d",
          textAlign: "center",
        }}
      >
        © 2024 Your Company. All rights reserved.
      </Typography>
      {/* Chính sách và điều khoản */}
      <Typography
        variant="body2"
        sx={{
          marginTop: 3,
          textAlign: "center",
          color: "#6c757d",
        }}
      >
        <Link
          sx={{
            background: "#878787",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
          }}
        >
          Điều khoản sử dụng
        </Link>
        |
        <Link
          href="/privacy"
          sx={{
            background: "#878787",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
          }}
        >
          Chính sách bảo mật
        </Link>
        .
      </Typography>
    </Box>
  );
};

export default LoginPage;
