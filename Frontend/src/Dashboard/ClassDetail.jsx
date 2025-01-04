import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ClassDetails = ({ classItem, goBack }) => {
  const [quizRecords, setQuizRecords] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, homeworkRes, attendanceRes] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${
              import.meta.env.VITE_APP_URL_BASE
            }/student/parent-quiz-records/`,
            { credentials: "include" }
          ),
          fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${
              import.meta.env.VITE_APP_URL_BASE
            }/student/parent-see-homeworks/`,
            { credentials: "include" }
          ),
          fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${
              import.meta.env.VITE_APP_URL_BASE
            }/student/parent-attendance/`,
            { credentials: "include" }
          ),
        ]);

        if (quizRes.ok) setQuizRecords(await quizRes.json());
        if (homeworkRes.ok) setHomeworks(await homeworkRes.json());
        if (attendanceRes.ok) {
          const allAttendance = await attendanceRes.json();
          const filteredAttendance = allAttendance.filter(
            (record) => record.Topic === classItem.Topic
          );
          setAttendance(filteredAttendance);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classItem.Topic]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const tableCellHeadStyle = {
    width: "50%",
    fontWeight: "bold",
    fontSize: { xs: "15px", sm: "17px" },
    textAlign: "center",
    backgroundColor: "#f0f0f0",
  };

  const tableCellBodyStyle = {
    width: "50%",
    fontSize: { xs: "14px", sm: "16px" },
    textAlign: "center",
  };

  return (
    <Box
      sx={{
        position: { xs: "relative", sm: "absolute" },
        left: { xs: "10px", sm: "190px" },
        right: { xs: "10px", sm: "20px" },
        maxWidth: { xs: "100%", sm: "1600px" },
        margin: "0 auto",
        padding: { xs: "10px", sm: "20px" },
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "relative",
          minHeight: { xs: 160, sm: 80 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
          mt: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: { xs: "50%", sm: "16px" },
            top: { xs: "20px", sm: "16px" },
            transform: {
              xs: "translateX(-50%)",
              sm: "none",
            },
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            variant="contained"
            color="primary"
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Back to Classes
          </Button>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "24px", sm: "28px" },
            textAlign: "center",
            mt: { xs: 10, sm: 0 },
          }}
        >
          {classItem.Topic} Details
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          mb: 3,
          width: "100%",
          position: { xs: "relative", sm: "sticky" },
          top: { sm: 0 },
          zIndex: 10,
          backgroundColor: "#fff",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={isMobile ? "scrollable" : "standard"}
          centered={!isMobile}
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minWidth: { xs: "70px", sm: "120px" },
              fontSize: { xs: "12px", sm: "15px" },
            },
          }}
        >
          <Tab label="Quiz Records" />
          <Tab label="Homeworks" />
          <Tab label="Attendance" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <TableContainer
          sx={{
            width: "100%",
            maxWidth: 600,
            mb: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellHeadStyle}>Title</TableCell>
                <TableCell sx={tableCellHeadStyle}>Degree</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizRecords.length > 0 ? (
                quizRecords.map((quiz, index) => (
                  <TableRow key={index}>
                    <TableCell sx={tableCellBodyStyle}>{quiz.Title}</TableCell>
                    <TableCell sx={tableCellBodyStyle}>{quiz.Degree}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                    No quiz records available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentTab === 1 && (
        <TableContainer
          sx={{
            width: "100%",
            maxWidth: 600,
            mb: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellHeadStyle}>Title</TableCell>
                <TableCell sx={tableCellHeadStyle}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {homeworks.length > 0 ? (
                homeworks.map((homework, index) => (
                  <TableRow key={index}>
                    <TableCell sx={tableCellBodyStyle}>
                      {homework.Title}
                    </TableCell>
                    <TableCell sx={tableCellBodyStyle}>
                      {homework.Graded
                        ? `Grade: ${homework.Grade}`
                        : "Not Graded"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                    No homework records available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {currentTab === 2 && (
        <TableContainer
          sx={{
            width: "100%",
            maxWidth: 600,
            mb: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellHeadStyle}>Date</TableCell>
                <TableCell sx={tableCellHeadStyle}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell sx={tableCellBodyStyle}>{record.Date}</TableCell>
                    <TableCell sx={tableCellBodyStyle}>
                      {record.Absent === "True" ? "Absent" : "Present"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                    No attendance records for this class.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ClassDetails;
