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
  const { recordId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentAnswers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-watch-student-answers/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizStudentRecordExplan_ID: recordId }),
          }
        );
        const answers = await response.json();

        // مقدار اولیه نمره‌ها
        const initialScores = {};
        answers.forEach((q) => {
          initialScores[q.id] = q.Correctness || 0;
        });

        setScores(initialScores);
        setQuestions(answers);
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
      // ارسال نمرات برای هر سؤال
      await Promise.all(
        questions.map((q) =>
          fetch(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-mark-student-answer/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                QuizQuestionStudentExplan_ID: q.id,
                Correctness: scores[q.id] || 0,
              }),
            }
          )
        )
      );

      // اتمام تصحیح
      await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/teacher-finish-mark/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ QuizStudentRecordExplan_ID: recordId }),
        }
      );

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
        // در صورت نیاز به موقعیت شناور در سایزهای مختلف:
        position: { xs: "static", sm: "absolute" },
        top: { xs: "auto", sm: "0" },
        left: 0,
        right: 0,
        bottom: { xs: "auto", sm: 0 },
        padding: 2,
      }}
    >
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
            overflow: "hidden",
          }}
        >
          {/* سؤال */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Question:
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {q.Question || "N/A"}
            </Typography>
          </Box>

          {/* پاسخ صحیح */}
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Correct Answer:
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {q.Answer || "N/A"}
            </Typography>
          </Box>

          {/* پاسخ دانش‌آموز */}
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Student Answer:
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {q.StudentAnswer}
            </Typography>
          </Box>

          {/* نمره‌دهی */}
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
                max: q.Zarib,
                step: 0.1,
              }}
              value={scores[q.id] || ""}
              onChange={(e) => handleScoreChange(q.id, e.target.value, q.Zarib)}
            />
          </Box>
        </Paper>
      ))}

      {/* دکمه نهایی ارسال نمرات */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleSubmitScores}>
          Submit Scores
        </Button>
      </Box>
    </Container>
  );
};

export default StudentAnswersPage;
