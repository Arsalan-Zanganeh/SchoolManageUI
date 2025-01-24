import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  LinearProgress, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Paper 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const QuizPageStudent = () => {
  const { quizId, cid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const quizEndTime = new Date(location.state?.quizEndTime).getTime();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-quiz-finished-boolean/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ QuizTeacher_ID: quizId }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.boolean) {
            navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
          }
        } else {
          console.error("Failed to check quiz status.");
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
      }
    };
  
    checkQuizStatus();
  }, [quizId, cid, navigate]);
  
  useEffect(() => {
    if (!location.state?.quizEndTime || !location.state?.cid) {
      navigate(`/student-dashboard/student-classes/${cid}`, { replace: true });
    }
  }, [location.state, cid, navigate]);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-show-questions/`, {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ QuizTeacher: quizId }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);

          setUserAnswers(Array(data.length).fill(null));
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
          alert('Time is up! Submitting your answers...');
          finishQuiz(); // ذخیره و پایان آزمون
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizEndTime, navigate, quizId]);

 
  useEffect(() => {
    if (userAnswers.length > 0) {
      setSelectedOption(userAnswers[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, userAnswers]);

  
  const handleAnswerSelect = (optionNumber) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
  
      // اگر همان گزینه‌ی قبلا انتخاب شده کلیک شد، خالی کن:
      if (selectedOption === optionNumber) {
        updatedAnswers[currentQuestionIndex] = null;
        setSelectedOption(null);
      } else {
        updatedAnswers[currentQuestionIndex] = optionNumber;
        setSelectedOption(optionNumber);
      }
  
      return updatedAnswers;
    });
  };
  

 
  const submitAnswer = async (isFinish = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      // پاسخ انتخابی را از آرایه‌ی userAnswers می‌خوانیم
      const selected = userAnswers[currentQuestionIndex] ?? 0;

      await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-answer-question/`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          StudentAnswer: selected,
          QuizQuestion_ID: currentQuestion.id,
        }),
      });

      // دیگر setSelectedOption(null) را حذف می‌کنیم تا وقتی به عقب برمی‌گردیم، مقدار بماند

      if (isFinish) {
        finishQuiz(); // پایان آزمون
      } else if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  /**
   * اتمام آزمون
   */
  const finishQuiz = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-finish-exam/`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ QuizTeacher: quizId }),
      });
  
      if (response.ok) {
        alert("You have finished your exam.");
        navigate(`/student-dashboard/student-classes/${location.state.cid}`, {
          state: { finishedQuizId: quizId },
          replace: true
        });
      } else {
        console.error("Error finishing quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (questions.length === 0) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
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
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        {/* Timer */}
        <Paper
          elevation={5}
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3f51b5, #1a237e)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 48, color: '#ffeb3b' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                fontFamily: 'Roboto Mono, monospace',
              }}
            >
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(timeRemaining / ((quizEndTime - Date.now()) / 1000)) * 100}
            sx={{
              height: 10,
              width: '100%',
              borderRadius: 5,
            }}
          />
        </Paper>

        {/* Question */}
        <Card elevation={4} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography
  variant="h5"
  sx={{
    mb: 3,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }}
>
  {questions[currentQuestionIndex]?.Question}
</Typography>

            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((optionNumber) => (
                <Grid item xs={12} sm={6} key={optionNumber}>
                  <Button
                    variant={selectedOption === optionNumber ? "contained" : "outlined"}
                    color={selectedOption === optionNumber ? "primary" : "secondary"}
                    fullWidth
                    onClick={() => handleAnswerSelect(optionNumber)}
                  >
                    Option {optionNumber}: {questions[currentQuestionIndex][`Option${optionNumber}`]}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<NavigateNextIcon />}
            onClick={() => submitAnswer(currentQuestionIndex === questions.length - 1)}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default QuizPageStudent;
