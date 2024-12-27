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
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DescriptiveQuizPage = () => {
  const { quizId, cid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const quizEndTime = new Date(location.state?.quizEndTime).getTime();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // بررسی وضعیت آزمون
    if (!location.state?.quizEndTime) {
      navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
    }

    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/quiz/student-show-questions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ QuizTeacherExplan: quizId }),
        });
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          console.error("Failed to fetch questions.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    const now = Date.now();
    const remainingTime = Math.max(0, Math.floor((quizEndTime - now) / 1000));
    setTimeRemaining(remainingTime);

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
  }, [quizEndTime, navigate, quizId]);

  const submitAnswer = async (isFinish = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await fetch("http://127.0.0.1:8000/quiz/student-answer-question/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          StudentAnswer: studentAnswer.trim(),
          QuizQuestionExplan_ID: currentQuestion.id,
        }),
      });
      setStudentAnswer("");

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
      const response = await fetch("http://127.0.0.1:8000/quiz/student-finish-exam/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ QuizTeacherExplan_ID: quizId }),
      });
      if (response.ok) {
        alert("You have finished your exam.");
      } else {
        console.error("Error finishing exam.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // هدایت به صفحه داشبورد پس از اتمام آزمون
      navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
    }
  };
  
  useEffect(() => {
    const now = Date.now();
    const remainingTime = Math.max(0, Math.floor((quizEndTime - now) / 1000));
    setTimeRemaining(remainingTime);
  
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time is up! Redirecting to your class...");
          finishQuiz(); // پایان آزمون در صورت تمام شدن زمان
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [quizEndTime, navigate, quizId]);
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questions.length === 0) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Loading questions...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Timer */}
      <Paper
        elevation={5}
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #3f51b5, #1a237e)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 48, color: "#ffeb3b" }} />
          <Typography variant="h4">{formatTime(timeRemaining)}</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(timeRemaining / ((quizEndTime - Date.now()) / 1000)) * 100}
          sx={{ height: 10, width: "100%", borderRadius: 5 }}
        />
      </Paper>

      {/* Question */}
      <Card elevation={4} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {questions[currentQuestionIndex]?.Question}
          </Typography>
          <TextField
            label="Your Answer"
            multiline
            rows={4}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitAnswer(currentQuestionIndex === questions.length - 1)}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </Button>
      </Box>
    </Container>
  );
};

export default DescriptiveQuizPage;
