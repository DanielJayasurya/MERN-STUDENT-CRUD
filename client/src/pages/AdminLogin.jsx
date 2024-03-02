import React, { useState } from "react";
import {
  Breadcrumbs,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import bgImg from "../assets/images/loginBg.jpg";
import { Link, useNavigate } from "react-router-dom";
import apiController from "../controller/apiController";
import CustomAlerts from "../components/CustomAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const AdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSuccessAlertClose = () => {
    setShowSuccessMessage(false);
  };

  const handleErrorAlertClose = () => {
    setShowErrorMessage(false);
  };

  const breadcrumbsStyle = {
    padding: "10px",
    background: "#f5f5f5",
    borderRadius: "4px",
  };

  const handleLogin = async () => {
    setError("");
    if (!userName || !password) {
      setError("Username and password are required");
      return;
    }
    try {
      const response = await apiController.post("/login", {
        username: userName,
        password: password,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate("/admin");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.message || "An error occurred";
      setErrorMessage(errorMessage);
      setShowErrorMessage(true);
      console.error("Error submitting registration:", error);
      setError("Invalid username or password");
    }
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" style={breadcrumbsStyle}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#3f51b5",
            fontFamily: "poppins",
            fontWeight: "bold",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Home
        </Link>
        <Typography
          style={{ fontFamily: "poppins", fontWeight: "bold" }}
          color="text.primary"
        >
          Login
        </Typography>
      </Breadcrumbs>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Grid item xs={12} sm={6}>
          <img
            src={bgImg}
            style={{ width: "80%", height: "auto" }}
            alt="Logo"
          />
        </Grid>
        <Grid item xs={12} sm={6} p={10}>
          <Typography
            style={{
              fontSize: "42px",
              fontWeight: 600,
              fontFamily: "poppins",
            }}
          >
            Admin <span>Login</span>
          </Typography>

          <TextField
            label="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography
              color="error"
              style={{ marginBottom: "1rem", fontFamily: "poppins" }}
            >
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            style={{
              backgroundColor: "#662d91",
              marginTop: "1rem",
              fontFamily: "poppins",
              fontSize: 15,
            }}
            onClick={handleLogin}
            fullWidth
          >
            Login
          </Button>
        </Grid>
        <CustomAlerts
          open={showErrorMessage}
          severity="error"
          message={errorMessage}
          handleClose={handleErrorAlertClose}
        />
        <CustomAlerts
          open={showSuccessMessage}
          severity="success"
          message="Login Successfully"
          handleClose={handleSuccessAlertClose}
        />
      </Grid>
    </>
  );
};

export default AdminLogin;
