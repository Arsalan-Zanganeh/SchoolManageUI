import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from "@mui/material";

const DescriptiveQuizResultsPage = () => {
  const { quizId, cid } = useParams();
  const navigate = useNavigate();

  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [quizRecord, setQuizRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/student-show-answers/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizTeacherExplan_ID: quizId }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setQuestionsAndAnswers(data);
        } else {
          console.error("Failed to fetch questions and answers.");
        }
      } catch (error) {
        console.error("Error fetching questions and answers:", error);
      }
    };

    const fetchQuizRecord = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/quiz/student-show-record/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ QuizTeacherExplan_ID: quizId }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setQuizRecord(data);
        } else {
          const errorData = await response.json();
          if (errorData.detail) {
            setError(errorData.detail);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz record:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndAnswers();
    fetchQuizRecord();
  }, [quizId]);

  const totalWeight = questionsAndAnswers.reduce((acc, qa) => acc + qa.Zarib, 0);

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading results...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        mt: 4,
        position: "absolute",
        top: { xs: "10%", sm: "0" },
        left: 0,
        right: 0,
        bottom: { xs: "auto", sm: 0 },
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        minHeight: "120vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Quiz Results
        </Typography>
        {error ? (
          <Typography variant="body1" align="center" color="error">
            {error}
          </Typography>
        ) : (
          quizRecord && (
            <Box>
              <Typography variant="h6" gutterBottom>
  Total Score: {Number(quizRecord.Degree100).toFixed(3)} / 100
</Typography>
              <Typography variant="h6" gutterBottom>
                Weight: {quizRecord.DegreeBarom} / {totalWeight}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Finished at: {new Date(quizRecord.FinishTime).toLocaleString()}
              </Typography>
            </Box>
          )
        )}
      </Paper>

      <Box>
        <Typography variant="h6" gutterBottom>
          Questions and Answers:
        </Typography>

        {questionsAndAnswers.map((qa) => (
          <Card
            key={qa.id}
            sx={{
              mb: 2,
              // overflow hidden برای جلوگیری از اسکرول افقی در صورت نیاز
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                // اختیاری: اگر می‌خواهید هنگام طولانی بودن متن اسکرول عمودی داشته باشید:
                // maxHeight: 300, overflowY: "auto",
              }}
            >
              {/* Question */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Question:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {qa.Question}
              </Typography>

              {/* Correct Answer */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Correct Answer:
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                sx={{
                  mb: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {qa.Answer}
              </Typography>

              {/* Student Answer */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Student Answer:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {qa.StudentAnswer}
              </Typography>

              {/* Score */}
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Score (Correctness):
              </Typography>
              {/* Score (Correctness): */}
<Typography variant="body1" color="success" sx={{ mb: 2 }}>
  {Number(qa.Correctness).toFixed(3)} / {Number(qa.Zarib).toFixed(3)}
</Typography>


              {/* Correctness Percentage */}
              <Typography variant="body2" color="text.secondary">
  Correctness Percentage: {Number(qa.Correctness100).toFixed(3)}%
</Typography>

            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default DescriptiveQuizResultsPage;
