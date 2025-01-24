import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResultsPage = () => {
  const { quizId, cid } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); 
  const [record, setRecord] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1) سوالات + پاسخ صحیح
        const answersResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-show-answers/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ QuizTeacher_ID: quizId })
        });

        // 2) پاسخ های دانش آموز
        const prevAnswersResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-quiz-prev-answers/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ QuizTeacher_ID: quizId })
        });

        // 3) رکورد نهایی (Degree)
        const recordResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-show-record/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ QuizTeacher_ID: quizId })
        });

        if (!answersResponse.ok || !prevAnswersResponse.ok || !recordResponse.ok) {
          console.error("Failed to fetch all data");
          setLoading(false);
          return;
        }

        const answersData = await answersResponse.json();
        const prevAnswersData = await prevAnswersResponse.json();
        const recordData = await recordResponse.json();

        const combinedQuestions = answersData.map(question => {
          const studentAnswerObj = prevAnswersData.find(pa => pa.QuizQuestion === question.id);
          const studentAnswer = studentAnswerObj ? studentAnswerObj.StudentAnswer : null;
          const isCorrect = studentAnswer === question.Answer;

          const studentAnswerText = studentAnswer 
            ? question[`Option${studentAnswer}`] 
            : 'Not Answered';
          const correctAnswerText = question[`Option${question.Answer}`];

          return {
            Question: question.Question,
            CorrectAnswer: question.Answer,
            CorrectAnswerText: correctAnswerText,
            StudentAnswer: studentAnswer,
            StudentAnswerText: studentAnswerText,
            isCorrect: isCorrect,
            Explanation: question.Explanation,
            Option1: question.Option1,
            Option2: question.Option2,
            Option3: question.Option3,
            Option4: question.Option4
          };
        });

        setQuestions(combinedQuestions);
        setRecord(recordData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [quizId]);

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6">Loading results...</Typography>
      </Container>
    );
  }

  if (!record || questions.length === 0) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          Failed to load results.
        </Typography>
      </Container>
    );
  }

  const percentage = record.Degree; 
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.isCorrect).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Quiz Results
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/student-dashboard/student-classes/${cid}`)}
        >
          Back to Class
        </Button>
      </Box>

      <Card elevation={4} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            Percentage: 
          </Typography>
          <Box sx={{ display:'flex', alignItems:'center', mb: 2 }}>
            <Box sx={{ width:'100%', mr:1 }}>
              <LinearProgress variant="determinate" value={percentage} />
            </Box>
            <Box sx={{ minWidth:35 }}>
              <Typography variant="body2" color="textSecondary">
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" color="textSecondary">
            Correct Answers:
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {correctAnswers} / {totalQuestions}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Question Breakdown
      </Typography>

      <Grid container spacing={2}>
        {questions.map((question, index) => (
          <Grid item xs={12} key={index}>
            <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
              <CardContent sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {/* Question title */}
                <Typography
                  variant="h6"
                  color="textPrimary"
                  sx={{ mb:1 }}
                >
                  Q{index + 1}: {question.Question}
                </Typography>

                {/* Student Answer */}
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Your Answer:{" "}
                  <strong>
                    {question.StudentAnswer
                      ? `Option ${question.StudentAnswer}: ${question.StudentAnswerText}`
                      : "Not Answered"}
                  </strong>
                </Typography>

                {/* Correct Answer */}
                <Typography variant="body1" color="textSecondary">
                  Correct Answer:{" "}
                  <strong>
                    Option {question.CorrectAnswer}: {question.CorrectAnswerText}
                  </strong>
                </Typography>

                {/* Is Correct or not */}
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: question.isCorrect ? "green" : "red"
                  }}
                >
                  {question.isCorrect ? "Correct" : "Incorrect"}
                </Typography>

                {/* Explanation */}
                {question.Explanation && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                  >
                    Explanation: {question.Explanation}
                  </Typography>
                )}

                {/* Options */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                >
                  <strong>Options:</strong>
                  <br />
                  1: {question.Option1}
                  <br />
                  2: {question.Option2}
                  <br />
                  3: {question.Option3}
                  <br />
                  4: {question.Option4}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResultsPage;
