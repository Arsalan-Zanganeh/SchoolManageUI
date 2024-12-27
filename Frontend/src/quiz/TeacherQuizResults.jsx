import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const TeacherQuizResults = () => {
  const { tcid, quizId } = useParams(); // گرفتن tcid و quizId از URL
  const [studentRecords, setStudentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student records
        const response = await fetch(
          "http://127.0.0.1:8000/quiz/teacher-watch-records/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizTeacherExplan_ID: quizId }),
          }
        );
        const records = await response.json();

        // Fetch student details for each record
        const updatedRecords = await Promise.all(
          records.map(async (record) => {
            const detailsResponse = await fetch(
              "http://127.0.0.1:8000/quiz/teacher-watch-record/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  QuizStudentRecordExplan_ID: record.id,
                }),
              }
            );
            const details = await detailsResponse.json();
            return { ...record, studentDetails: details };
          })
        );

        setStudentRecords(updatedRecords);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [quizId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleRowClick = (recordId) => {
    navigate(
      `/teacher-dashboard/teacher-classes/${tcid}/essay-quizzes/${quizId}/student-records/${recordId}`
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 ,
        position: 'absolute',
        top: { xs: '10%', sm: '0' }, 
        left: 0,
        right: 0,
        bottom: { xs: 'auto', sm: 0 }, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
     }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Teacher Quiz Results
      </Typography>

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                First Name
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                Last Name
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                National ID
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                Finish Time
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                Marked
              </TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentRecords.map((record) => (
              <TableRow
                key={record.id}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(record.id)}
              >
                <TableCell align="center">
                  {record.studentDetails?.first_name || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {record.studentDetails?.last_name || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {record.studentDetails?.National_ID || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {new Date(record.FinishTime).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {record.marked === 1 ? "Yes" : "No"}
                </TableCell>
                <TableCell align="center">
                  {record.Degree100 || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeacherQuizResults;
