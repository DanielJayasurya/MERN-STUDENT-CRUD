import {
  Backdrop,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import apiController from "../controller/apiController";
import CustomAlerts from "../components/CustomAlert";

function RegistrationModel({
  open,
  onClose,
  fetchRegistrations,
  editingRegistration,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dob: "",
    gender: "select",
    location: "",
    roll_no: "",
  });

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSuccessAlertClose = () => {
    setShowSuccessMessage(false);
  };

  const handleErrorAlertClose = () => {
    setShowErrorMessage(false);
  };

  useEffect(() => {
    if (editingRegistration) {
      setFormData({
        firstName: editingRegistration.first_name,
        lastName: editingRegistration.last_name,
        phoneNumber: editingRegistration.phone_number,
        dob: formatedDate(editingRegistration.dob),
        email: editingRegistration.email,
        gender: editingRegistration.gender,
        location: editingRegistration.location,
        roll_no: editingRegistration.roll_no,
      });
    }
  }, [editingRegistration]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const handleSelectChange = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
    setErrors({ ...errors, [fieldName]: "" });
  };

  const handleDateChange = (event) => {
    setFormData({ ...formData, dob: event.target.value });
    setErrors({ ...errors, dob: "" });
  };

  const formatedDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  const handleSubmit = async (e) => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]{1,20}$/.test(formData.firstName)) {
      newErrors.firstName = "Only characters are allowed";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]{1,20}$/.test(formData.lastName)) {
      newErrors.lastName = "Only characters are allowed";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.gender || formData.gender === "select") {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dob) {
      newErrors.dob = "DOB is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    } else if (!/^[A-Za-z ]{1,25}$/.test(formData.location)) {
      newErrors.location = "Only characters are allowed up to 25";
    }
    if (!formData.roll_no) {
      newErrors.roll_no = "Roll No is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        dob,
        email,
        gender,
        location,
        roll_no,
      } = formData;

      const data = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        dob: dob,
        email: email,
        gender: gender,
        location: location,
        roll_no: roll_no,
      };

      if (editingRegistration) {
        const response = await apiController.put(
          `/registration/${editingRegistration.s_id}`,
          data
        );
        console.log(response.data);
        fetchRegistrations();
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          onClose();
        }, 1000);
      } else {
        const result = await apiController.post("/registration", data);
        console.log(result.data);
        fetchRegistrations();
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          dob: "",
          gender: "select",
          location: "",
          roll_no: "",
        });
        fetchRegistrations();
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
      console.error("Error submitting registration:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
    setFormData({});
  };

  const genderOptions = [
    { value: "select", label: "-- select one --" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "others", label: "Others" },
  ];

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
                    {editingRegistration
                      ? "Edit Student Details"
                      : "Add student Details"}
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
                      First name<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.firstName && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.firstName}
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
                      Last Name<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.lastName && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.lastName}
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
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      DOB<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Click to set DOB"
                      InputLabelProps={{
                        shrink: true,
                        required: true,
                      }}
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                      type="date"
                      value={formData.dob}
                      onChange={handleDateChange}
                      sx={{
                        padding: "0",
                        margin: "0",
                        width: "100%",
                      }}
                    />
                    {errors.dob && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.dob}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel
                        style={{
                          fontSize: "15px",
                          fontFamily: "poppins",
                          color: "#000000",
                        }}
                      >
                        Gender
                        <span className="error">*</span>
                      </FormLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleSelectChange("gender")}
                        sx={{ height: "40px" }}
                      >
                        {genderOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Typography style={{ fontFamily: "poppins" }}>
                              {option.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.gender && (
                        <Typography
                          style={{ fontSize: "15px", fontFamily: "poppins" }}
                          color="error"
                        >
                          {errors.gender}
                        </Typography>
                      )}
                    </FormControl>
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
                      Phone Number<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.phoneNumber && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.phoneNumber}
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
                      Email<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.email && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.email}
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
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#000000",
                      }}
                    >
                      Roll No<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="roll_no"
                      value={formData.roll_no}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.roll_no && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.roll_no}
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
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    >
                      Location<span className="error">*</span>
                    </Typography>
                    <TextField
                      size="small"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        style: { fontFamily: "poppins" },
                      }}
                    />
                    {errors.location && (
                      <Typography
                        style={{ fontSize: "15px", fontFamily: "poppins" }}
                        color="error"
                      >
                        {errors.location}
                      </Typography>
                    )}
                  </Grid>
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
}

export default RegistrationModel;
