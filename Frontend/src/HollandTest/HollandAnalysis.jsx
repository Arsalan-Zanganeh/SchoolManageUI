import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const HollandResults = ({goBack, gotoHolland}) => {
  const location = useLocation();
  const scores = location.state?.scores;

  // فلگ برای کنترل اجرای درخواست
  const hasSubmitted = useRef(false);

  if (!scores) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8bbd0",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
          No data available. Please take the test first.
        </Typography>
        <Button
          onClick={() => goBack()}
          variant="contained"
          sx={{
            textTransform: "none",
            padding: "10px 20px",
            backgroundColor: "#f06292",
            "&:hover": { backgroundColor: "#e91e63" },
          }}
        >
          Go Back to Test
        </Button>
      </Box>
    );
  }

  const keyMapping = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional",
  };

  const personalityDescriptions = {
    Realistic: {
      name: "Realistic",
      description: "You are a practical and hands-on individual who enjoys physical tasks and working with tangible objects. Your strong preference for solving problems using tools, machines, or manual skills often makes you excel in mechanical, technical, or outdoor activities. You thrive in environments where you can see tangible results of your efforts and value straightforward and concrete solutions. Physical effort and coordination come naturally to you, and you often enjoy working with your hands. You prefer structured tasks over abstract concepts and excel in roles requiring physical dexterity and endurance. Nature and outdoor activities are often appealing to you. You also appreciate jobs that offer independence or clear responsibilities, and repetitive tasks or routines don’t deter you." ,

      careers: "Suggested careers: Engineer, Mechanic, Farmer, Professional Athlete.",
    },
    Investigative: {
      name: "Investigative",
      description:                      
      "You are highly analytical, curious, and motivated by intellectual challenges. Problem-solving and discovering how things work energize you. You thrive in environments where you can experiment, analyze, or theorize and enjoy diving deep into details or complex systems. You prefer tasks that require precision and are often drawn to mathematics, science, or technology. Your work often involves innovation and developing new knowledge or solutions. Communication is less of a focus for you than exploring and solving problems independently. You may excel at creating models, conducting experiments, and thinking critically. Challenges involving abstract thinking or data analysis excite you, and you often enjoy solitude or working in focused environments.",

      careers: "Suggested careers: Scientist, Doctor, Programmer, Researcher.",
    },
    Artistic: {
      name: "Artistic",
      description:                   
       "You are a creative and innovative thinker who enjoys self-expression and originality. You thrive in unstructured environments where you can explore your imagination and emotions freely. Your talents often lie in creating art, music, literature, or other forms of creative expression. You are drawn to beauty, aesthetics, and unique ideas. Conventional rules or rigid routines are less appealing to you, and you prefer roles that value inspiration and spontaneity. You tend to be introspective, open-minded, and sensitive to your surroundings, making you excellent at storytelling or conceptualizing ideas. Collaboration in creative teams or working alone to refine your craft can both bring satisfaction. You often find fulfillment in crafting meaningful or transformative experiences for others." ,

      careers: "Suggested careers: Writer, Designer, Actor, Architect.",
    },
    Social: {
      name: "Social",
      description:                      
      "You are empathetic, supportive, and motivated by helping and connecting with others. Your ability to understand people's needs and emotions makes you an excellent communicator and a natural team player. You thrive in environments where you can nurture and guide others, often forming meaningful and lasting relationships. Teaching, counseling, or organizing community activities are roles that appeal to your personality. You enjoy environments where collaboration and trust are key, and you find fulfillment in fostering growth or positive change in others. Your patience, active listening skills, and compassion are among your strongest traits. Conflict resolution and mentorship are areas where you naturally excel. Working in dynamic environments with diverse groups often suits you best.",

      careers: "Suggested careers: Teacher, Counselor, Social Worker, Psychologist.",
    },
    Enterprising: {
      name: "Enterprising",
      description:                  
       "You are a confident, ambitious, and goal-oriented individual who thrives in leadership roles. You enjoy influencing others, managing projects, and taking risks to achieve success. Negotiation, persuasion, and public speaking come naturally to you, making you effective in competitive or fast-paced environments. You often excel at identifying opportunities and taking initiative to turn ideas into action. A natural leader, you enjoy roles where you can inspire, delegate, and make impactful decisions. You value recognition and personal achievement, and you often enjoy the challenge of overcoming obstacles. Building networks and creating strategic plans are strengths, and you are not afraid to take responsibility for ambitious goals. " ,

      careers: "Suggested careers: Manager, Marketer, Entrepreneur, Politician.",
    },
    Conventional: {
      name: "Conventional",
      description:                   
       "You are organized, methodical, and detail-oriented, thriving in environments where structure, rules, and order are prioritized. You excel in roles that require precision, reliability, and attention to detail. Your natural inclination for routine and clear guidelines helps you complete tasks efficiently and effectively. You value stability and predictability in your work and enjoy working with data, records, or systems. Planning, organizing, and managing information are some of your strongest skills. You often prefer behind-the-scenes roles, where your contribution ensures that operations run smoothly. While creativity and spontaneity might not be your focus, you find satisfaction in maintaining consistency and ensuring quality. Analytical thinking and a strong sense of responsibility make you a valuable team member or administrator." ,

      careers: "Suggested careers: Accountant, Banker, Office Manager, Administrative Staff.",
    },
  };

  const maxScore = Math.max(...Object.values(scores));
  const dominantTypes = Object.entries(scores)
    .filter(([type, score]) => score === maxScore)
    .map(([type]) => keyMapping[type]);

  const submitResultsToAPI = async () => {
    const dataToSend = Object.keys(personalityDescriptions).reduce((acc, type) => {
      acc[type] = dominantTypes.includes(type);
      return acc;
    }, {});

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-submit-halland/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Data submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    if (!hasSubmitted.current) {
      submitResultsToAPI();
      hasSubmitted.current = true; // فلگ تنظیم می‌شود
    }
  }, []);

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
        backgroundColor: "#e3f2fd",
        padding: "20px",
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          maxHeight: "80vh",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent
          sx={{
            padding: "30px",
            overflowY: "auto",
            maxHeight: "calc(80vh - 60px)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#0d47a1",
            }}
          >
            Your Personality Analysis
          </Typography>
          {dominantTypes.map((type) => (
            <Box key={type} sx={{ marginBottom: "20px" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#1565c0" }}
              >
                {personalityDescriptions[type]?.name} ({type})
              </Typography>
              <Typography sx={{ marginBottom: "10px" }}>
                {personalityDescriptions[type]?.description}
              </Typography>
              <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                {personalityDescriptions[type]?.careers}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              textAlign: "center",
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                padding: "10px 20px",
                backgroundColor: "#42a5f5",
                "&:hover": { backgroundColor: "#1e88e5" },
              }}
              onClick={() => gotoHolland()}
            >
              Retake the Test
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                padding: "10px 20px",
                borderColor: "#42a5f5",
                color: "#42a5f5",
                "&:hover": { borderColor: "#1e88e5", color: "#1e88e5" },
              }}
              onClick={() => goBack()}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HollandResults;
