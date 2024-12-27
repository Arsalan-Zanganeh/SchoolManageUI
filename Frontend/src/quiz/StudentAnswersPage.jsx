import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const StudentAnswersPage = () => {
  const { recordId } = useParams(); // گرفتن recordId از URL
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentAnswers = async () => {
      try {
        // Fetch questions and answers
        const response = await fetch(
          "http://127.0.0.1:8000/quiz/teacher-watch-student-answers/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizStudentRecordExplan_ID: recordId }),
          }
        );
        const answers = await response.json();

        // تنظیم مقدار اولیه نمره‌ها
        const initialScores = {};
        answers.forEach((q) => {
          initialScores[q.id] = q.Correctness || 0; // اگر Correctness وجود نداشت، مقدار اولیه 0 خواهد بود
        });

        setScores(initialScores);
        setQuestions(answers); // ذخیره مستقیم پاسخ‌ها
      } catch (error) {
        console.error("Error fetching questions or answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAnswers();
  }, [recordId]);

  const handleScoreChange = (id, value, max) => {
    const score = parseFloat(value);
    if (score >= 0 && score <= max) {
      setScores({ ...scores, [id]: score });
    }
  };

  const handleSubmitScores = async () => {
    try {
      // Submit scores for each question
      await Promise.all(
        questions.map((q) =>
          fetch("http://127.0.0.1:8000/quiz/teacher-mark-student-answer/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              QuizQuestionStudentExplan_ID: q.id,
              Correctness: scores[q.id] || 0,
            }),
          })
        )
      );

      // Finish marking
      await fetch("http://127.0.0.1:8000/quiz/teacher-finish-mark/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ QuizStudentRecordExplan_ID: recordId }),
      });

      alert("Marking completed successfully!");
      navigate(-1); // بازگشت به صفحه قبلی
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
    sx={{ 
        position: 'absolute',
        top: { xs: '10%', sm: '0' }, 
        left: 0,
        right: 0,
        bottom: { xs: 'auto', sm: 0 }, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        
      }}>
      <Typography variant="h5" align="center" gutterBottom>
        Student Answers
      </Typography>

      {questions.map((q) => (
        <Paper
          key={q.id}
          sx={{
            padding: 2,
            marginBottom: 3,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Question:
            </Typography>
            <Typography>{q.Question || "N/A"}</Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Correct Answer:
            </Typography>
            <Typography>{q.Answer || "N/A"}</Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Student Answer:
            </Typography>
            <Typography>{q.StudentAnswer}</Typography>
          </Box>

          <Box mt={2} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Maximum Score:
            </Typography>
            <Typography>{q.Zarib}</Typography>
          </Box>

          <Box mt={2} display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Score:
            </Typography>
            <TextField
              type="number"
              inputProps={{
                min: 0,
                max: q.Zarib, // محدود کردن نمره به مقدار Maximum Score
                step: 0.1,
              }}
              value={scores[q.id] || ""} // مقدار اولیه بر اساس Correctness
              onChange={(e) => handleScoreChange(q.id, e.target.value, q.Zarib)}
            />
          </Box>
        </Paper>
      ))}

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSubmitScores}>
          Submit Scores
        </Button>
      </Box>
    </Container>
  );
};

export default StudentAnswersPage;
