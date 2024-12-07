import React, { useState } from "react";
import { Button, Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';
const questions = [
    {
      id: 1,
      text: "Do you enjoy working with tools or machinery?",
      options: [
        { text: "1 (Not at all)", score: { R: 1 } },
        { text: "2 (Slightly)", score: { R: 2 } },
        { text: "3 (Moderately)", score: { R: 3 } },
        { text: "4 (Quite a bit)", score: { R: 4 } },
        { text: "5 (Definitely)", score: { R: 5 } },
      ],
    },
    {
      id: 2,
      text: "Do you like solving puzzles or investigating problems?",
      options: [
        { text: "1 (Not at all)", score: { I: 1 } },
        { text: "2 (Slightly)", score: { I: 2 } },
        { text: "3 (Moderately)", score: { I: 3 } },
        { text: "4 (Quite a bit)", score: { I: 4 } },
        { text: "5 (Definitely)", score: { I: 5 } },
      ],
    },
    {
      id: 3,
      text: "Do you enjoy expressing yourself through art, music, or writing?",
      options: [
        { text: "1 (Not at all)", score: { A: 1 } },
        { text: "2 (Slightly)", score: { A: 2 } },
        { text: "3 (Moderately)", score: { A: 3 } },
        { text: "4 (Quite a bit)", score: { A: 4 } },
        { text: "5 (Definitely)", score: { A: 5 } },
      ],
    },
    {
      id: 4,
      text: "Do you enjoy helping others solve their problems?",
      options: [
        { text: "1 (Not at all)", score: { S: 1 } },
        { text: "2 (Slightly)", score: { S: 2 } },
        { text: "3 (Moderately)", score: { S: 3 } },
        { text: "4 (Quite a bit)", score: { S: 4 } },
        { text: "5 (Definitely)", score: { S: 5 } },
      ],
    },
    {
      id: 5,
      text: "Do you like leading or persuading others to achieve a goal?",
      options: [
        { text: "1 (Not at all)", score: { E: 1 } },
        { text: "2 (Slightly)", score: { E: 2 } },
        { text: "3 (Moderately)", score: { E: 3 } },
        { text: "4 (Quite a bit)", score: { E: 4 } },
        { text: "5 (Definitely)", score: { E: 5 } },
      ],
    },
    {
      id: 6,
      text: "Do you like organizing or categorizing information?",
      options: [
        { text: "1 (Not at all)", score: { C: 1 } },
        { text: "2 (Slightly)", score: { C: 2 } },
        { text: "3 (Moderately)", score: { C: 3 } },
        { text: "4 (Quite a bit)", score: { C: 4 } },
        { text: "5 (Definitely)", score: { C: 5 } },
      ],
    },
    {
      id: 7,
      text: "Do you enjoy designing, creating, or building things?",
      options: [
        { text: "1 (Not at all)", score: { R: 1 } },
        { text: "2 (Slightly)", score: { R: 2 } },
        { text: "3 (Moderately)", score: { R: 3 } },
        { text: "4 (Quite a bit)", score: { R: 4 } },
        { text: "5 (Definitely)", score: { R: 5 } },
      ],
    },
    {
      id: 8,
      text: "Do you like exploring new ideas or conducting experiments?",
      options: [
        { text: "1 (Not at all)", score: { I: 1 } },
        { text: "2 (Slightly)", score: { I: 2 } },
        { text: "3 (Moderately)", score: { I: 3 } },
        { text: "4 (Quite a bit)", score: { I: 4 } },
        { text: "5 (Definitely)", score: { I: 5 } },
      ],
    },
    {
      id: 9,
      text: "Do you enjoy performing or sharing your artistic talents?",
      options: [
        { text: "1 (Not at all)", score: { A: 1 } },
        { text: "2 (Slightly)", score: { A: 2 } },
        { text: "3 (Moderately)", score: { A: 3 } },
        { text: "4 (Quite a bit)", score: { A: 4 } },
        { text: "5 (Definitely)", score: { A: 5 } },
      ],
    },
    {
      id: 10,
      text: "Do you like assisting or teaching others?",
      options: [
        { text: "1 (Not at all)", score: { S: 1 } },
        { text: "2 (Slightly)", score: { S: 2 } },
        { text: "3 (Moderately)", score: { S: 3 } },
        { text: "4 (Quite a bit)", score: { S: 4 } },
        { text: "5 (Definitely)", score: { S: 5 } },
      ],
    },
    {
    id: 11,
    text: "Do you enjoy fixing or repairing mechanical items?",
    options: [
      { text: "1 (Not at all)", score: { R: 1 } },
      { text: "2 (Slightly)", score: { R: 2 } },
      { text: "3 (Moderately)", score: { R: 3 } },
      { text: "4 (Quite a bit)", score: { R: 4 } },
      { text: "5 (Definitely)", score: { R: 5 } },
    ],
  },
  {
    id: 12,
    text: "Do you enjoy analyzing data or interpreting research results?",
    options: [
      { text: "1 (Not at all)", score: { I: 1 } },
      { text: "2 (Slightly)", score: { I: 2 } },
      { text: "3 (Moderately)", score: { I: 3 } },
      { text: "4 (Quite a bit)", score: { I: 4 } },
      { text: "5 (Definitely)", score: { I: 5 } },
    ],
  },
  {
    id: 13,
    text: "Do you like expressing yourself through storytelling or drama?",
    options: [
      { text: "1 (Not at all)", score: { A: 1 } },
      { text: "2 (Slightly)", score: { A: 2 } },
      { text: "3 (Moderately)", score: { A: 3 } },
      { text: "4 (Quite a bit)", score: { A: 4 } },
      { text: "5 (Definitely)", score: { A: 5 } },
    ],
  },
  {
    id: 14,
    text: "Do you enjoy mentoring or guiding others in their personal growth?",
    options: [
      { text: "1 (Not at all)", score: { S: 1 } },
      { text: "2 (Slightly)", score: { S: 2 } },
      { text: "3 (Moderately)", score: { S: 3 } },
      { text: "4 (Quite a bit)", score: { S: 4 } },
      { text: "5 (Definitely)", score: { S: 5 } },
    ],
  },
  {
    id: 15,
    text: "Do you enjoy managing or directing projects or teams?",
    options: [
      { text: "1 (Not at all)", score: { E: 1 } },
      { text: "2 (Slightly)", score: { E: 2 } },
      { text: "3 (Moderately)", score: { E: 3 } },
      { text: "4 (Quite a bit)", score: { E: 4 } },
      { text: "5 (Definitely)", score: { E: 5 } },
    ],
  },
  {
    id: 16,
    text: "Do you like maintaining detailed records or managing schedules?",
    options: [
      { text: "1 (Not at all)", score: { C: 1 } },
      { text: "2 (Slightly)", score: { C: 2 } },
      { text: "3 (Moderately)", score: { C: 3 } },
      { text: "4 (Quite a bit)", score: { C: 4 } },
      { text: "5 (Definitely)", score: { C: 5 } },
    ],
  },
  {
    id: 17,
    text: "Do you enjoy working outdoors or in natural environments?",
    options: [
      { text: "1 (Not at all)", score: { R: 1 } },
      { text: "2 (Slightly)", score: { R: 2 } },
      { text: "3 (Moderately)", score: { R: 3 } },
      { text: "4 (Quite a bit)", score: { R: 4 } },
      { text: "5 (Definitely)", score: { R: 5 } },
    ],
  },
  {
    id: 18,
    text: "Do you enjoy using technology to solve complex problems?",
    options: [
      { text: "1 (Not at all)", score: { I: 1 } },
      { text: "2 (Slightly)", score: { I: 2 } },
      { text: "3 (Moderately)", score: { I: 3 } },
      { text: "4 (Quite a bit)", score: { I: 4 } },
      { text: "5 (Definitely)", score: { I: 5 } },
    ],
  },
  {
    id: 19,
    text: "Do you enjoy painting, drawing, or creating visual designs?",
    options: [
      { text: "1 (Not at all)", score: { A: 1 } },
      { text: "2 (Slightly)", score: { A: 2 } },
      { text: "3 (Moderately)", score: { A: 3 } },
      { text: "4 (Quite a bit)", score: { A: 4 } },
      { text: "5 (Definitely)", score: { A: 5 } },
    ],
  },
  {
    id: 20,
    text: "Do you like volunteering or contributing to community projects?",
    options: [
      { text: "1 (Not at all)", score: { S: 1 } },
      { text: "2 (Slightly)", score: { S: 2 } },
      { text: "3 (Moderately)", score: { S: 3 } },
      { text: "4 (Quite a bit)", score: { S: 4 } },
      { text: "5 (Definitely)", score: { S: 5 } },
    ],
  },
  {
    id: 21,
    text: "Do you like setting financial or sales goals for others?",
    options: [
      { text: "1 (Not at all)", score: { E: 1 } },
      { text: "2 (Slightly)", score: { E: 2 } },
      { text: "3 (Moderately)", score: { E: 3 } },
      { text: "4 (Quite a bit)", score: { E: 4 } },
      { text: "5 (Definitely)", score: { E: 5 } },
    ],
  },
  {
    id: 22,
    text: "Do you like keeping everything in its proper place?",
    options: [
      { text: "1 (Not at all)", score: { C: 1 } },
      { text: "2 (Slightly)", score: { C: 2 } },
      { text: "3 (Moderately)", score: { C: 3 } },
      { text: "4 (Quite a bit)", score: { C: 4 } },
      { text: "5 (Definitely)", score: { C: 5 } },
    ],
  },
  {
    id: 23,
    text: "Do you enjoy operating heavy machinery or specialized equipment?",
    options: [
      { text: "1 (Not at all)", score: { R: 1 } },
      { text: "2 (Slightly)", score: { R: 2 } },
      { text: "3 (Moderately)", score: { R: 3 } },
      { text: "4 (Quite a bit)", score: { R: 4 } },
      { text: "5 (Definitely)", score: { R: 5 } },
    ],
  },
  {
    id: 24,
    text: "Do you like performing experiments or testing hypotheses?",
    options: [
      { text: "1 (Not at all)", score: { I: 1 } },
      { text: "2 (Slightly)", score: { I: 2 } },
      { text: "3 (Moderately)", score: { I: 3 } },
      { text: "4 (Quite a bit)", score: { I: 4 } },
      { text: "5 (Definitely)", score: { I: 5 } },
    ],
  },
  {
    id: 25,
    text: "Do you enjoy composing music or writing lyrics?",
    options: [
      { text: "1 (Not at all)", score: { A: 1 } },
      { text: "2 (Slightly)", score: { A: 2 } },
      { text: "3 (Moderately)", score: { A: 3 } },
      { text: "4 (Quite a bit)", score: { A: 4 } },
      { text: "5 (Definitely)", score: { A: 5 } },
    ],
  },
  {
    id: 26,
    text: "Do you like assisting others in overcoming challenges?",
    options: [
      { text: "1 (Not at all)", score: { S: 1 } },
      { text: "2 (Slightly)", score: { S: 2 } },
      { text: "3 (Moderately)", score: { S: 3 } },
      { text: "4 (Quite a bit)", score: { S: 4 } },
      { text: "5 (Definitely)", score: { S: 5 } },
    ],
  },
  {
    id: 27,
    text: "Do you enjoy persuading others to see things your way?",
    options: [
      { text: "1 (Not at all)", score: { E: 1 } },
      { text: "2 (Slightly)", score: { E: 2 } },
      { text: "3 (Moderately)", score: { E: 3 } },
      { text: "4 (Quite a bit)", score: { E: 4 } },
      { text: "5 (Definitely)", score: { E: 5 } },
    ],
  },
  {
    id: 28,
    text: "Do you like designing or maintaining organizational systems?",
    options: [
      { text: "1 (Not at all)", score: { C: 1 } },
      { text: "2 (Slightly)", score: { C: 2 } },
      { text: "3 (Moderately)", score: { C: 3 } },
      { text: "4 (Quite a bit)", score: { C: 4 } },
      { text: "5 (Definitely)", score: { C: 5 } },
    ],
  },
  {
    id: 29,
    text: "Do you enjoy working with animals or in agricultural settings?",
    options: [
      { text: "1 (Not at all)", score: { R: 1 } },
      { text: "2 (Slightly)", score: { R: 2 } },
      { text: "3 (Moderately)", score: { R: 3 } },
      { text: "4 (Quite a bit)", score: { R: 4 } },
      { text: "5 (Definitely)", score: { R: 5 } },
    ],
  },
  {
    id: 30,
    text: "Do you enjoy creating budgets or financial plans?",
    options: [
      { text: "1 (Not at all)", score: { C: 1 } },
      { text: "2 (Slightly)", score: { C: 2 } },
      { text: "3 (Moderately)", score: { C: 3 } },
      { text: "4 (Quite a bit)", score: { C: 4 } },
      { text: "5 (Definitely)", score: { C: 5 } },
    ],
  },
  ];
  

const HollandQuestions = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const questionsPerPage = 1;
  const navigate = useNavigate();
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const calculateScores = () => {
    const totalScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    Object.values(answers).forEach((score) => {
      Object.entries(score).forEach(([key, value]) => {
        totalScores[key] += value;
      });
    });

    return totalScores;
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      const finalScores = calculateScores();
      console.log("Final Scores:", finalScores);
      navigate('/holland-test/analysis', { state: { scores: finalScores } });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dce8fd",
        padding: "20px",
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ padding: "30px" }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
            Holland Test Questions
          </Typography>
  
          <LinearProgress
            variant="determinate"
            value={((currentPage + 1) / Math.ceil(questions.length / questionsPerPage)) * 100}
            sx={{ marginBottom: "20px" }}
          />
  
          {currentQuestions.map((question) => (
            <Box key={question.id} sx={{ marginBottom: "20px" }}>
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                {question.text}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      answers[question.id]?.[Object.keys(option.score)[0]] ===
                      Object.values(option.score)[0]
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleAnswer(question.id, option.score)}
                  >
                    {option.text}
                  </Button>
                ))}
              </Box>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              sx={{ textTransform: "none", padding: "10px 20px" }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ textTransform: "none", padding: "10px 20px" }}
            >
              {currentPage < Math.ceil(questions.length / questionsPerPage) - 1
                ? "Next"
                : "Submit"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HollandQuestions;
