import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

const TeacherResult = () => {
  const { qid } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        // Fetch quiz records
        const response = await fetch(
          "http://127.0.0.1:8000/api/teacher-watch-records/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ Quiz_ID: parseInt(qid, 10) }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch quiz records");

        const records = await response.json();

        // Fetch student data for each record
        const detailedResults = await Promise.all(
          records.map(async (record) => {
            try {
              const studentResponse = await fetch(
                "http://127.0.0.1:8000/api/teacher-watch-record/",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ QuizStudentRecord_ID: record.id }),
                }
              );

              if (!studentResponse.ok) throw new Error("Failed to fetch student data");

              const studentData = await studentResponse.json();
              return { ...record, student: studentData };
            } catch (error) {
              console.error(error);
              return { ...record, student: null };
            }
          })
        );

        setResults(detailedResults);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [qid]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (results.length === 0) {
      return (
        <Typography variant="body1" align="center" sx={{ mt: 4, color: theme.palette.text.secondary }}>
          No results found for this quiz.
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
              {[
                "Student Name",
                "National ID",
                "Score",
                "Finish Time",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow
                key={result.id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell align="center">
                  {result.student
                    ? `${result.student.first_name} ${result.student.last_name}`
                    : "-"}
                </TableCell>
                <TableCell align="center">{result.student?.National_ID || "-"}</TableCell>
                <TableCell align="center">{result.Degree}</TableCell>
                <TableCell align="center">
                  {result.FinishTime ? new Date(result.FinishTime).toLocaleString() : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#DCE8FD",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        Quiz Results
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default TeacherResult;
