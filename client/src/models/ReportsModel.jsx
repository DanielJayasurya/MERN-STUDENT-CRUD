import {
  Backdrop,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import apiController from "../controller/apiController";
import CustomAlerts from "../components/CustomAlert";

const ReportsModel = ({ open, onClose, reportData, getReports }) => {
  const [english, setEnglish] = useState("");
  const [tamil, setTamil] = useState("");
  const [maths, setMaths] = useState("");
  const [science, setScience] = useState("");
  const [social, setSocial] = useState("");
  const [sId, setSId] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccessAlertClose = () => {
    setShowSuccessMessage(false);
  };

  const handleErrorAlertClose = () => {
    setShowErrorMessage(false);
  };

  useEffect(() => {
    if (reportData) {
      setEnglish(reportData.english || "");
      setTamil(reportData.tamil || "");
      setMaths(reportData.maths || "");
      setScience(reportData.science || "");
      setSocial(reportData.social || "");
      setSId(reportData.s_id || "");
      setName(reportData.first_name + " " + reportData.last_name || "");
    }
  }, [reportData]);

  const validateForm = () => {
    const errors = {};

    if (!english.trim()) {
      errors.english = "English is required";
    } else if (parseInt(english, 10) > 100) {
      errors.english = "English value must be 100 or less";
    }

    if (!tamil.trim()) {
      errors.tamil = "Tamil is required";
    } else if (parseInt(tamil, 10) > 100) {
      errors.tamil = "Tamil value must be 100 or less";
    }

    if (!maths.trim()) {
      errors.maths = "Maths is required";
    } else if (parseInt(maths, 10) > 100) {
      errors.maths = "Maths value must be 100 or less";
    }

    if (!science.trim()) {
      errors.science = "Science is required";
    } else if (parseInt(science, 10) > 100) {
      errors.science = "Science value must be 100 or less";
    }

    if (!social.trim()) {
      errors.social = "Social is required";
    } else if (parseInt(social, 10) > 100) {
      errors.social = "Social value must be 100 or less";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const data = { english, tamil, maths, science, social, s_id: sId };
      try {
        const response = await apiController.put(
          `/reports/${reportData.s_id}`,
          data
        );
        if (response) {
          getReports();
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            onClose();
          }, 1000);
        }
      } catch (error) {
        const errorMessage = error.message || "An error occurred";
        setErrorMessage(errorMessage);
        setShowErrorMessage(true);
        console.error("Error submitting report:", error);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Backdrop
          open={open}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Paper
            style={{
              maxWidth: "850px",
              minHeight: "27rem",
              margin: "5%",
              borderRadius: "10px",
            }}
          >
            <Grid container>
              <Grid
                item
                sx={{ display: "flex", padding: "15px 33px 8px 15px" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "3%",
                  }}
                >
                  <FaAngleDoubleRight size={25} style={{ color: "#662d91" }} />
                  <Typography
                    style={{ whiteSpace: "nowrap", fontFamily: "poppins" }}
                  >
                    Report
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <hr />
            <form>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    gap: "4%",
                    padding: "10px 20px 0px 20px",
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      S_ID<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="s_id"
                      value={sId}
                      fullWidth
                      disabled
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Name
                    </Typography>
                    <TextField
                      size="small"
                      name="name"
                      fullWidth
                      value={name}
                      disabled
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    gap: "4%",
                    padding: "10px 20px 0px 20px",
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      English<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="english"
                      value={english}
                      onChange={(e) => setEnglish(e.target.value)}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.english && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.english}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Tamil<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="tamil"
                      value={tamil}
                      onChange={(e) => setTamil(e.target.value)}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.tamil && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.tamil}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    gap: "4%",
                    padding: "10px 20px 0px 20px",
                  }}
                >
                  <Grid item xs={12} lg={6}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Maths<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="maths"
                      value={maths}
                      onChange={(e) => setMaths(e.target.value)}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.maths && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.maths}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Science<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="science"
                      value={science}
                      onChange={(e) => setScience(e.target.value)}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.science && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.science}
                      </Typography>
                    )}
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
                    message="Successfully Submitted"
                    handleClose={handleSuccessAlertClose}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    gap: "4%",
                    padding: "10px 20px 0px 20px",
                  }}
                >
                  <Grid item xs={6}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Social<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="social"
                      value={social}
                      onChange={(e) => setSocial(e.target.value)}
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.social && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.social}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                align="start"
                mt={0}
              >
                <Box display="flex" m={2}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    size="medium"
                    id="text-13-500-20-Inter"
                    style={{
                      background: "#662d91",
                      textTransform: "capitalize",
                      borderRadius: "6px",
                      width: "130px",
                      height: "35px",
                      "&:hover": {
                        backgroundColor: "#662d91",
                      },
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleClose}
                    sx={{
                      ml: 2,
                      background: "#662d91",
                      textTransform: "capitalize",
                      borderRadius: "6px",
                      width: "130px",
                      height: "35px",
                      "&:hover": {
                        backgroundColor: "#662d91",
                      },
                    }}
                    id="text-13-500-20-Inter"
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </form>
          </Paper>
        </Backdrop>
      </Modal>
    </>
  );
};

export default ReportsModel;
