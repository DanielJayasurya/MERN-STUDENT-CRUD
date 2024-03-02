import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { MdAppRegistration, MdExitToApp } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAlerts from "../components/CustomAlert";

function Navbar({ title }) {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isLoggedIn = localStorage.getItem("token");
  const name = localStorage.getItem("username");
  const userName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  const navigate = useNavigate();

  const handleSuccessAlertClose = () => {
    setShowSuccessMessage(false);
  };

  const handleErrorAlertClose = () => {
    setShowErrorMessage(false);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleLoginAndlogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/");
      }, 1000);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Box sx={{ height: "48px" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#662d91",
            padding: "15px",
            boxShadow: "none",
            height: "3rem",
          }}
        >
          <Toolbar
            style={{
              padding: "0px",
              minHeight: "0px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid sx={{ display: "flex", alignItems: "center" }}>
              <MdAppRegistration
                size={25}
                style={{ color: "#fff", cursor: "pointer" }}
                onClick={handleHome}
              />
              <Box sx={{ paddingLeft: ".5em" }}>
                <Typography style={{ fontSize: 20, fontFamily: "Poppins" }}>
                  {title}
                </Typography>
              </Box>
            </Grid>
            <Grid sx={{ display: "flex", alignItems: "center" }}>
              {isLoggedIn && (
                <Box pr={4}>
                  <Typography
                    sx={{ fontFamily: "poppins", textWrap: "nowrap" }}
                  >
                    Welcome, {userName}
                  </Typography>
                </Box>
              )}
              <Box>
                <Button
                  variant="contained"
                  size="small"
                  title="Admin Login"
                  sx={{
                    color: "#000",
                    backgroundColor: "#fff",
                    height: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#FFF",
                    },
                  }}
                  onClick={handleLoginAndlogout}
                >
                  {isLoggedIn ? (
                    <>
                      <MdExitToApp size={25} />
                      <Typography sx={{ fontFamily: "poppins" }}>
                        Logout
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: "flex" }}>
                        <MdLock size={25} style={{ color: "#000" }} />
                        <Typography
                          sx={{ fontFamily: "poppins", color: "#000" }}
                        >
                          Login
                        </Typography>
                      </Box>
                    </>
                  )}
                </Button>
              </Box>
            </Grid>
          </Toolbar>
        </AppBar>
        <CustomAlerts
          open={showErrorMessage}
          severity="error"
          message="Logout Failed"
          handleClose={handleErrorAlertClose}
        />
        <CustomAlerts
          open={showSuccessMessage}
          severity="success"
          message="Logout Successfully"
          handleClose={handleSuccessAlertClose}
        />
      </Box>
    </>
  );
}

export default Navbar;
