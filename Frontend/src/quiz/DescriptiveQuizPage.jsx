import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DescriptiveQuizPage = () => {
  const { quizId, cid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const quizEndTime = new Date(location.state?.quizEndTime).getTime();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // اگر به شکل مستقیم وارد شدیم و quizEndTime در state نبود
    if (!location.state?.quizEndTime) {
      navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
    }

    // گرفتن سؤالات از سرور
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/student-show-questions/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizTeacherExplan: quizId }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          setStudentAnswers(Array(data.length).fill(""));
        } else {
          console.error("Failed to fetch questions.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    // محاسبه زمان باقی‌مانده
    const now = Date.now();
    const remainingTime = Math.max(0, Math.floor((quizEndTime - now) / 1000));
    setTimeRemaining(remainingTime);

    // ایجاد تایمر شمارش معکوس
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time is up! Submitting your answers...");
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizEndTime, navigate, quizId, cid, location.state?.quizEndTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChange = (e) => {
    const newValue = e.target.value;
    setStudentAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[currentQuestionIndex] = newValue;
      return updated;
    });
  };

  const submitAnswer = async (isFinish = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/student-answer-question/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            StudentAnswer: studentAnswers[currentQuestionIndex].trim(),
            QuizQuestionExplan_ID: currentQuestion.id,
          }),
        }
      );

      if (isFinish) {
        finishQuiz();
      } else if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const finishQuiz = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/student-finish-exam/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ QuizTeacherExplan_ID: quizId }),
        }
      );
      if (response.ok) {
        alert("You have finished your exam.");
      } else {
        console.error("Error finishing exam.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
    }
  };

  if (questions.length === 0) {
    return (
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e1f0ff", // پس‌زمینه آبی کم‌رنگ
        }}
      >
        <Typography variant="h6">Loading questions...</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#DCE8FD',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          {/* تایمر */}
          <Grid item xs={12} md={12} textAlign="center">
            <Paper
              elevation={4}
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                px: 3,
                py: 2,
                borderRadius: 2,
                background: "#3F51B5",
                color: "#fff",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 32, color: "#ffeb3b" }} />
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={
                    (timeRemaining / ((quizEndTime - Date.now()) / 1000)) * 100
                  }
                  sx={{ height: 8, borderRadius: 2 }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* باکس سوال */}
          <Grid item xs={12} md={12}>
            <Card
              elevation={4}
              sx={{
                // اندازه فیکس (یا حداکثر) برای باکس
                width: "90%",
                maxWidth: "800px",
                margin: "0 auto",
                borderRadius: 3,
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>

                {/* اگر متن سؤال طولانی باشد به صورت چندخطی بشکند */}
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {questions[currentQuestionIndex]?.Question}
                </Typography>

                <TextField
                  label="Your Answer"
                  multiline
                  rows={5}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={studentAnswers[currentQuestionIndex]}
                  onChange={handleAnswerChange}
                />

                {/* دکمه‌های پایینی */}
                <Box sx={{ display: "flex", justifyContent: "space-between" , gap :2}}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      submitAnswer(currentQuestionIndex === questions.length - 1)
                    }
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? "Next"
                      : "Finish"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DescriptiveQuizPage;
