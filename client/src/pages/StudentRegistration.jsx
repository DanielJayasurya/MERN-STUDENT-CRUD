import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { IoMail } from "react-icons/io5";
import { BiArrowToTop } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import RegistrationModel from "../models/RegistrationModel";
import apiController from "../controller/apiController";
import * as XLSX from "xlsx";

const StudentRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [data, setData] = useState([]);
  const [keywordsInputValue, setKeywordsInputValue] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const screenWidth = window.innerWidth;

  const handleRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const keywordsFilter = () => {
    if (keywordsInputValue !== null && keywordsInputValue !== undefined) {
      const filteredData = data.filter(
        (registration) =>
          (registration.first_name && registration.first_name.toLowerCase().includes(keywordsInputValue.toLowerCase())) ||
          (registration.last_name && registration.last_name.toLowerCase().includes(keywordsInputValue.toLowerCase())) ||
          (registration.location && registration.location.toLowerCase().includes(keywordsInputValue.toLowerCase())) ||
          (registration.email && registration.email.toLowerCase().includes(keywordsInputValue.toLowerCase())) ||
          (registration.status && registration.status.toLowerCase().includes(keywordsInputValue.toLowerCase())) ||
          (registration.roll_no && registration.roll_no.toString().includes(keywordsInputValue)) ||
          (registration.total && registration.total.toString().includes(keywordsInputValue))
      );
      setRegistrations(filteredData);
    }
  };
  

  const fetchRegistrations = async () => {
    try {
      const response = await apiController.get("/registration");
      setRegistrations(response.data.students);
      setData(response.data.students);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const handleOpenDialog = (registration) => {
    setSelectedRegistration(registration);
    setDeleteConfirmation(true);
    console.log(registration);
  };

  const handleCloseDialog = () => {
    setSelectedRegistration(null);
    setDeleteConfirmation(false);
  };

  const handleDelete = async () => {
    try {
      await apiController.delete(`/registration/${selectedRegistration.s_id}`);
      fetchRegistrations();
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const [editingRegistration, setEditingRegistration] = useState(null);

  const handleEdit = (registration) => {
    setEditingRegistration(registration);
    setIsRegistrationModalOpen(true);
  };

  const handleExcelDownload = () => {
    const data = registrations.map((registration) => ({
      Name: `${registration.first_name} ${registration.last_name}`,
      DOB: registration.dob,
      RollNo: registration.roll_no,
      PhoneNumber: registration.phone_number,
      Location: registration.location,
      Email: registration.email,
      TotalMarks: registration.total,
      Status: registration.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    const excelFileName = "student_registrations.xlsx";
    XLSX.writeFile(wb, excelFileName);
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 100;
      setIsVisible(scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const passFilterCount = data.filter((x) => x.status === "Pass");
  const FailFilterCount = data.filter((x) => x.status === "Fail");

  const countCircle = [
    {
      count: registrations.length,
      label: "Total",
      name: "Total",
    },
    {
      count: passFilterCount.length,
      label: "Pass",
      name: "Pass",
    },
    {
      count: FailFilterCount.length,
      label: "Fail",
      name: "Fail",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [studentsSortColumn, setstudentsSortColumn] = useState("");
  const [studentsSortOrder, setstudentsSortOrder] = useState("asc");

  const [marksSortColumn, setMarksSortColumn] = useState("");
  const [marksSortOrder, setMarksSortOrder] = useState("asc");

  const handleSortStudentsName = () => {
    const sortedData = [...registrations];
    if (studentsSortOrder === "asc") {
      sortedData.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else {
      sortedData.sort((a, b) => b.first_name.localeCompare(a.first_name));
    }
    setRegistrations(sortedData);
    setstudentsSortOrder(studentsSortOrder === "asc" ? "desc" : "asc");
    setstudentsSortColumn("Students");
  };

  const handleSortMarks = () => {
    const sortedData = [...registrations];

    sortedData.sort((a, b) => {
      const aValue = a.total !== null ? a.total.toString() : "";
      const bValue = b.total !== null ? b.total.toString() : "";

      if (marksSortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setRegistrations(sortedData);
    setMarksSortOrder(marksSortOrder === "asc" ? "desc" : "asc");
    setMarksSortColumn("Marks");
  };

  return (
    <>
      <Grid pb={7}>
        <Grid
          container
          p={2}
          xl={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item xs={12} md={9}>
            <TextField
              onChange={(e) => setKeywordsInputValue(e.target.value)}
              value={keywordsInputValue}
              placeholder="Search Keywords"
              variant="outlined"
              sx={{
                "& input::placeholder": { fontSize: "13px" },
                paddingBottom: "1rem",
              }}
              InputProps={{
                style: {
                  border: "none",
                  width: "612px",
                  height: "45px",
                },

                endAdornment: (
                  <IconButton
                    aria-label="Search"
                    onClick={() => {
                      keywordsFilter();
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <Box mt={1}>
              <Button
                onClick={handleRegistration}
                variant="contained"
                style={{
                  textTransform: "capitalize",
                  backgroundColor: "#662d91",
                }}
              >
                <Typography style={{ fontFamily: "poppins" }}>
                  Add Student
                </Typography>
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            md={3}
            xs={12}
            justifyContent="space-between"
            sx={{ display: "flex", gap: "1%" }}
          >
            {countCircle.map((box, index) => (
              <Grid
                item
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  ...(screenWidth < 903 && {
                    marginTop: "1rem",
                  }),
                }}
              >
                <Box
                  sx={{
                    background: "#EFEFEF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0",
                    width: "50px",
                    height: "50px",
                    flexShrink: 0,
                    border: "3px solid #662d91",
                    transition: "background-color 0.3s",
                    
                  }}
                  title={box.label}
                >
                  <Typography sx={{ fontFamily: "poppins" }}>
                    {box.count}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "poppins" }}>
                  {box.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid p={2} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleExcelDownload}
            variant="contained"
            style={{
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
              gap: "4px",
              backgroundColor: "#662d91",
            }}
          >
            {" "}
            <FaFileExcel
              size={20}
              style={{ display: "flex", justifyContent: "flex-start" }}
            />{" "}
            <Typography style={{ fontFamily: "poppins" }}>
              Download Details in Excel{" "}
            </Typography>
          </Button>
        </Grid>

        <Grid p={2}>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ display: "flex", gap: "2%", alignItems: "center" }}
                  >
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Students
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {studentsSortColumn === "Students" &&
                        studentsSortOrder === "asc" && (
                          <ExpandLessIcon
                            onClick={() => handleSortStudentsName("Students")}
                            style={{
                              color: "#662d91",
                            }}
                          />
                        )}
                      {studentsSortColumn === "Students" &&
                        studentsSortOrder === "desc" && (
                          <ExpandMoreOutlinedIcon
                            onClick={() => handleSortStudentsName("Students")}
                            style={{
                              color: "#662d91",
                              margin: "0",
                              padding: "0",
                            }}
                          />
                        )}
                      {studentsSortColumn !== "Students" && (
                        <RiExpandUpDownFill
                          title="Sort students names by ascending and descending"
                          size={20}
                          onClick={() => handleSortStudentsName("Students")}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Roll No
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      DOB
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ display: "flex", alignItems: "center", gap: "2%" }}
                  >
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Total Marks
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {marksSortColumn === "Marks" &&
                        marksSortOrder === "asc" && (
                          <ExpandLessIcon
                            onClick={() => handleSortMarks("Marks")}
                            style={{
                              color: "#662d91",
                            }}
                          />
                        )}
                      {marksSortColumn === "Marks" &&
                        marksSortOrder === "desc" && (
                          <ExpandMoreOutlinedIcon
                            onClick={() => handleSortMarks("Marks")}
                            style={{
                              color: "#662d91",
                              margin: "0",
                              padding: "0",
                            }}
                          />
                        )}
                      {marksSortColumn !== "Marks" && (
                        <RiExpandUpDownFill
                          size={20}
                          onClick={() => handleSortMarks("Marks")}
                          title="Sort students marks by ascending and descending"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.length > 0 ? (
                  registrations.map((registration) => (
                    <TableRow key={registration.s_id}>
                      <TableCell style={{ width: "22rem" }}>
                        <Grid>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2%",
                              marginLeft: ".2rem",
                            }}
                          >
                            <Typography
                              style={{ fontFamily: "poppins", fontSize: 15 }}
                            >
                              {registration.first_name} {registration.last_name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "2%",
                              alignItems: "center",
                              marginTop: ".4em",
                            }}
                          >
                            <Box sx={{ width: "18px", height: "18px" }}>
                              <PhoneAndroidIcon
                                sx={{
                                  color: "#662d91",
                                  height: "20px",
                                  width: "20px",
                                  margin: "0",
                                  padding: "0",
                                }}
                              />
                            </Box>
                            <Typography
                              style={{ fontFamily: "poppins", fontSize: 15 }}
                            >
                              {registration.phone_number}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "1%",
                              alignItems: "center",
                              marginTop: ".4em",
                            }}
                          >
                            <LocationOnIcon
                              sx={{
                                color: "#662d91",
                                height: "22px",
                                width: "22px",
                                margin: "0",
                                padding: "0",
                              }}
                            />
                            <Typography
                              style={{
                                marginTop: "2px",
                                fontFamily: "poppins",
                                fontSize: 15,
                                textTransform: "capitalize",
                              }}
                            >
                              {registration.location}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2%",
                              marginTop: ".3em",
                            }}
                          >
                            <IoMail
                              style={{
                                color: "#662d91",
                                height: "20px",
                                width: "20px",
                                margin: "0",
                                padding: "0",
                              }}
                            />
                            <Typography
                              style={{ fontFamily: "poppins", fontSize: 15 }}
                            >
                              <a
                                className="email-link"
                                href={`mailto:${registration.email}`}
                              >
                                {registration.email}
                              </a>
                            </Typography>
                          </Box>
                        </Grid>
                      </TableCell>
                      <TableCell style={{ width: "15rem" }}>
                        <Typography
                          style={{
                            fontFamily: "poppins",
                            fontSize: 15,
                            textTransform: "capitalize",
                          }}
                        >
                          {registration.roll_no}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          align="left"
                          style={{ fontFamily: "poppins", fontSize: 15 }}
                        >
                          {
                            new Date(registration.dob)
                              .toISOString()
                              .split("T")[0]
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          style={{
                            fontFamily: "poppins",
                            fontSize: 15,
                            textTransform: "capitalize",
                          }}
                        >
                          {registration.total}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          style={{
                            fontFamily: "poppins",
                            fontSize: 15,
                            textTransform: "capitalize",
                          }}
                        >
                          {registration.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "10%",
                            alignItems: "center",
                          }}
                        >
                          <MdEdit
                            style={{
                              height: "25px",
                              width: "25px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEdit(registration)}
                            title="Edit Registration"
                          />
                          <MdDelete
                            style={{
                              height: "25px",
                              width: "25px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenDialog(registration)}
                            title="Delete Registration"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography style={{ fontFamily: "poppins" }}>
                        No details to display
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={deleteConfirmation} onClose={handleCloseDialog}>
            <DialogTitle style={{ fontFamily: "poppins" }}>
              Delete Confirmation
            </DialogTitle>
            <DialogContent style={{ fontFamily: "poppins" }}>
              Are you sure you want to delete this registration?
            </DialogContent>
            <DialogActions>
              <Button
                style={{ fontFamily: "poppins" }}
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                style={{ fontFamily: "poppins" }}
                onClick={handleDelete}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      {isVisible && (
        <Box
          sx={{
            backgroundColor: "#662d91",
            height: "2rem",
            width: "2rem",
            position: "fixed",
            bottom: "35px",
            right: "20px",
            zIndex: "1000",
            borderRadius: "50px",
            cursor:"pointer"
          }}
        >
          <BiArrowToTop
            size={25}
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "38px",
              right: "23px",
              zIndex: "1000",
              color: "#fff",
            }}
            title="scroll to top"
          />
        </Box>
      )}

      <RegistrationModel
        open={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setEditingRegistration(null);
        }}
        fetchRegistrations={fetchRegistrations}
        editingRegistration={editingRegistration}
      />
    </>
  );
};

export default StudentRegistration;
