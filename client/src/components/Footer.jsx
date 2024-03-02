import { Grid, Typography } from "@mui/material";
import React from "react";

const Footer = ({ title }) => {
  return (
    <Grid
      sx={{
        height: "1.8rem",
        width: "100%",
        backgroundColor: "#662d91",
        color: "#fff",
        position: "fixed",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        style={{ fontFamily: "poppins", fontSize: "15px", textAlign: "center" }}
      >
        {title}
      </Typography>
    </Grid>
  );
};

export default Footer;
