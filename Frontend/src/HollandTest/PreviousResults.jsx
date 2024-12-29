import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const PreviousResults = ({goBack}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-watch-halland-records/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (row) => {
    const selectedTypes = Object.entries(row)
      .filter(([key, value]) => value === true && key !== "id" && key !== "OnParticipation")
      .map(([key]) => key);
  
    const descriptions = selectedTypes
      .map((type) => personalityDescriptions[type])
      .filter(Boolean); 
  
    if (descriptions.length > 0) {
      setSelectedType(descriptions);
      setOpen(true);
    }
  };
  

  const handleClose = () => {
    setOpen(false);
    setSelectedType(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f4f8",
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8d7da",
          color: "#842029",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#f9fafe",
        padding: "20px",
        paddingTop: "100px", // فاصله بیشتر از بالای صفحه

      }}
    >
      {/* عنوان */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
          color: "#1a237e",
          borderBottom: "4px solid #1a237e",
          paddingBottom: "10px",
        }}
      >
        Previous Holland Test Results
      </Typography>
  
      {/* جدول نتایج */}
      <TableContainer
        component={Paper}
        sx={{
          width: "90%",
          maxWidth: "1080px",
          borderRadius: "16px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          marginBottom: "20px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#3949ab",
              }}
            >
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Personality Traits
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                On Participation
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f4f8fd" },
                  "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#e8eaf6" },
                }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell
                  sx={{
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "#3e4c59",
                    textAlign: "center",
                  }}
                >
                  {Object.entries(row)
                    .filter(([key, value]) => value === true && key !== "id" && key !== "OnParticipation")
                    .map(([key]) => key)
                    .join(", ") || "No data"}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    fontWeight: "medium",
                    color: "#3e4c59",
                    textAlign: "center",
                  }}
                >
                  {row.OnParticipation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* دیالوگ توضیحات */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            backgroundColor: "#3949ab",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Selected Personality Types
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "20px",
            backgroundColor: "#f9fafe",
          }}
        >
          {selectedType?.map((type, index) => (
            <Box
              key={index}
              sx={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1a237e", marginBottom: "10px" }}
              >
                {type.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#424242", marginBottom: "8px" }}
              >
                {type.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#757575", fontStyle: "italic" }}
              >
                {type.careers}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#f4f4f4",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: "#3949ab",
              "&:hover": { backgroundColor: "#303f9f" },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Button
            onClick={goBack}
            sx={{
              color: "white",
              backgroundColor: "#3949ab",
              "&:hover": { backgroundColor: "#303f9f" },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Back
          </Button>
    </Box>
  );
  
};

export default PreviousResults;
