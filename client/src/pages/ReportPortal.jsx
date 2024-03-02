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
import React from "react";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useEffect } from "react";
import ReportsModel from "../models/ReportsModel";
import SearchIcon from "@mui/icons-material/Search";
import { RiExpandUpDownFill } from "react-icons/ri";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { MdDelete } from "react-icons/md";
import { BiArrowToTop } from "react-icons/bi";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiController from "../controller/apiController";
import { useDispatch, useSelector } from "react-redux";
import { setReports } from "../redux/reportSlice";

const ReportPortal = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.list);
  const [data, setData] = useState([]);
  const [isReportModelOpen, setIsReportModelOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [keywordsInputValue, setKeywordsInputValue] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleReportCloseModel = () => {
    setIsReportModelOpen(false);
    setSelectedReport(null);
  };

  const handleReport = (report) => {
    setSelectedReport(report);
    setIsReportModelOpen(true);
  };

  const handleOpenDialog = (report) => {
    setSelectedReport(report);
    setDeleteConfirmation(true);
  };
  const handleCloseDialog = () => {
    setDeleteConfirmation(false);
  };

  const handleDelete = async () => {
    try {
      await apiController.delete(`/registration/${selectedReport.s_id}`);
      getReports();
      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  const getReports = async () => {
    try {
      const response = await apiController.get("/reports");
      if (response) {
        dispatch(setReports(response.data.marks));
        setData(response.data.marks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReports();
  },[dispatch]);

  const [marksSortColumn, setMarksSortColumn] = useState("");
  const [marksSortOrder, setMarksSortOrder] = useState("asc");

  const [sIdColumn, setSIdSortColumn] = useState("");
  const [sIdSortOrder, setSIdSortOrder] = useState("asc");

  const handleSortMarks = () => {
    const sortedData = [...reports];

    sortedData.sort((a, b) => {
      const aValue = a.total !== null ? a.total.toString() : "";
      const bValue = b.total !== null ? b.total.toString() : "";

      if (marksSortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    dispatch(setReports(sortedData));
    setMarksSortOrder(marksSortOrder === "asc" ? "desc" : "asc");
    setMarksSortColumn("Marks");
  };

  const handleSId = () => {
    const sortedData = [...reports];
    sortedData.sort((a, b) => {
      const aValue = a.s_id !== null ? a.s_id : 0;
      const bValue = b.s_id !== null ? b.s_id : 0;

      if (sIdSortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    dispatch(setReports(sortedData));
    setSIdSortOrder(sIdSortOrder === "asc" ? "desc" : "asc");
    setSIdSortColumn("s_id");
  };

  const keywordsFilter = () => {
    const filteredData = data.filter(
      (registration) =>
        registration.s_id.toString().includes(keywordsInputValue) ||
        registration.first_name
          .toLowerCase()
          .includes(keywordsInputValue.toLowerCase()) ||
        registration.last_name
          .toLowerCase()
          .includes(keywordsInputValue.toLowerCase())
    );
    dispatch(setReports(filteredData));
  };

  const handleExcelDownload = () => {
    const data = reports.map((report) => ({
      S_ID: report.s_id,
      Name: `${report.first_name} ${report.last_name}`,
      English: report.english,
      Tamil: report.tamil,
      Maths: report.maths,
      Science: report.science,
      Social: report.social,
      Total: report.total,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "reports");
    const excelFileName = "student_reports.xlsx";
    XLSX.writeFile(wb, excelFileName);
  };

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Grid p={3}>
        <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
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
          </Box>
  
        </Grid>
        <Grid style={{display:"flex",justifyContent:"flex-end"}}>
        <Box>
            <Button
              onClick={handleExcelDownload}
              variant="contained"
              style={{
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
                gap: "4px",
                backgroundColor: "#662d91",
                textOverflow:"ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              <FaFileExcel
                size={20}
                style={{ display: "flex", justifyContent: "flex-start" }}
              />
              <Typography style={{ fontFamily: "poppins" }}>
                Download Details in Excel
              </Typography>
            </Button>
          </Box>
        </Grid>

        <Grid>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ display: "flex", alignItems: "center", gap: "2%" }}
                  >
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      Student ID
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {sIdColumn === "s_id" && sIdSortOrder === "asc" && (
                        <ExpandLessIcon
                          onClick={() => handleSId("s_id")}
                          style={{
                            color: "#662d91",
                          }}
                        />
                      )}
                      {sIdColumn === "s_id" && sIdSortOrder === "desc" && (
                        <ExpandMoreOutlinedIcon
                          onClick={() => handleSId("s_id")}
                          style={{
                            color: "#662d91",
                            margin: "0",
                            padding: "0",
                          }}
                        />
                      )}
                      {sIdColumn !== "s_id" && (
                        <RiExpandUpDownFill
                          size={20}
                          onClick={() => handleSId("s_id")}
                          title="Sort students ID by ascending and descending"
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
                      Name
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
                      English
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
                      Tamil
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
                      Maths
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
                      science
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
                      Social
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ display: "flex", alignItems: "center", gap: "2%" }}
                  >
                    <Typography
                      style={{
                        fontFamily: "poppins",
                        fontWeight: 800,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Total Marks
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {marksSortColumn === "Marks" &&
                        marksSortOrder === "asc" && (
                          <ExpandLessIcon
                            onClick={() => handleSortMarks("first_name")}
                            style={{
                              color: "#662d91",
                            }}
                          />
                        )}
                      {marksSortColumn === "Marks" &&
                        marksSortOrder === "desc" && (
                          <ExpandMoreOutlinedIcon
                            onClick={() => handleSortMarks("first_name")}
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
                          onClick={() => handleSortMarks("first_name")}
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
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.marks_id}>
                      <TableCell style={{ width: "12rem" }}>
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
                              {report.s_id}
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
                          {report.first_name} {report.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          align="left"
                          style={{ fontFamily: "poppins", fontSize: 15 }}
                        >
                          {report.english}
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
                          {report.tamil}
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
                          {report.maths}
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
                          {report.science}
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
                          {report.social}
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
                          {report.total}
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
                            onClick={() => handleReport(report)}
                            title="Edit report"
                          />
                          <MdDelete
                            style={{
                              height: "25px",
                              width: "25px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenDialog(report)}
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
              Are you sure you want to delete this report?
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
            cursor: "pointer",
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
      <ReportsModel
        open={isReportModelOpen}
        onClose={handleReportCloseModel}
        reportData={selectedReport}
        getReports={getReports}
      />
    </>
  );
};

export default ReportPortal;
