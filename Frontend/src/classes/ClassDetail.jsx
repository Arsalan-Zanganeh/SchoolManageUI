import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Card, CardContent, Grid, Divider, Paper } from '@mui/material';

const ClassDetails = () => {
  const { cid } = useParams(); 
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]); 
  const [classDetails, setClassDetails] = useState(null); 
  const [tabValue, setTabValue] = useState(0); 

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/student/classes/", {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Data:", data);

          setClassList(data);

          const selectedClass = data.find((cls) => cls.id === parseInt(cid));
          setClassDetails(selectedClass);
        } else {
          console.error('Failed to fetch class list');
        }
      } catch (error) {
        console.error('Error fetching class list:', error);
      }
    };

    fetchClassList();
  }, [cid]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCardClick = (type, id) => {
    if (type === 'assignment') {
      navigate(`/student-dashboard/student-classes/${cid}/assignment/${id}`);
    } else if (type === 'quiz') {
      navigate(`/student-dashboard/student-classes/${cid}/quiz/${id}`);
    }
  };
  

  if (!classDetails) {
    return <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>Loading class details...</Typography>;
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '800px', margin: 'auto' }}>
      <Paper 
        elevation={3} 
        sx={{ padding: 2, marginBottom: 3, backgroundColor: 'primary.light', borderRadius: 2 }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          {classDetails.Topic}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Instructor:</strong> {classDetails.Teacher}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Session 1:</strong> {classDetails.Session1Day} - {classDetails.Session1Time}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Session 2:</strong> {classDetails.Session2Day} - {classDetails.Session2Time}
            </Typography>
          </Grid>
        </Grid>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)} 
          sx={{ marginTop: 2 }}
        >
          Back
        </Button>
      </Paper>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="Class details tabs" 
        sx={{ marginBottom: 3, borderBottom: 1, borderColor: 'divider' }}
        textColor="primary" 
        indicatorColor="primary"
      >
        <Tab label="Quizzes" sx={{ fontWeight: 'bold' }} />
        <Tab label="Assignments" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
            Recent Quizzes
          </Typography>
          <Card
            variant="outlined"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => handleCardClick('quiz', 1)}
          >
            <CardContent>
              <Typography>Quiz 1: JavaScript Basics - <strong>Due on 2024-12-10</strong></Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => handleCardClick('quiz', 2)}
          >
            <CardContent>
              <Typography>Quiz 2: React Fundamentals - <strong>Due on 2024-12-15</strong></Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
            Recent Assignments
          </Typography>
          <Card
                variant="outlined"
                sx={{ marginBottom: 2, cursor: 'pointer' }}
                onClick={() => handleCardClick('assignment', 1)} 
                >
                <CardContent>
                    <Typography>Assignment 1: Create a portfolio website - <strong>Due on 2024-12-05</strong></Typography>
                </CardContent>
                </Card>

                <Card
                variant="outlined"
                sx={{ marginBottom: 2, cursor: 'pointer' }}
                onClick={() => handleCardClick('assignment', 2)} 
                >
                <CardContent>
                    <Typography>Assignment 2: Build a React application - <strong>Due on 2024-12-12</strong></Typography>
                </CardContent>
            </Card>

        </Box>
      )}
    </Box>
  );
};

export default ClassDetails;