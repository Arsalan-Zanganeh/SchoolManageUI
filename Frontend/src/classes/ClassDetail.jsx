import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Tabs, Tab, Card, CardContent, Grid, Divider, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';

const ClassDetails = () => {
  const { cid } = useParams(); 
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]); 
  const [classDetails, setClassDetails] = useState(null); 
  const [tabValue, setTabValue] = useState(0); 
  const [homeworks, setHomeworks] = useState([]); 
  const [selectedHomework, setSelectedHomework] = useState(null); 
  const [records, setRecords] = useState([]); 
  const [openDialog, setOpenDialog] = useState(false); 
  const [file, setFile] = useState(null); 

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

  useEffect(() => {
    if (classDetails) {
      const fetchHomeworks = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/student-see-homeworks/", {
            method : "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setHomeworks(data);
          } else {
            console.error('Failed to fetch homeworks');
          }
        } catch (error) {
          console.error('Error fetching homeworks:', error);
        }
      };

      fetchHomeworks();
    }
  }, [classDetails]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDialogOpen = (homework) => {
    setSelectedHomework(homework);
    fetchHomeworkRecords(homework.id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFile(null);
  };

  const extractFileName = (filePath) => {
    if (!filePath) return ''; 

    return filePath.split('/').pop();
  };

  const fetchHomeworkRecords = async (homeworkId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/student-homework-records/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Homework_ID: homeworkId }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch homework records');
      }
    } catch (error) {
      console.error('Error fetching homework records:', error);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('Homework_ID', selectedHomework.id); 
    formData.append('HomeWorkAnswer', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/student-send-homework/", {
        method: 'POST',
        headers: {
        },
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        console.log('File submitted successfully');
        setFile(null);
        fetchHomeworkRecords(selectedHomework.id); 
      } else {
        console.error('Failed to submit file');
      }
    } catch (error) {
      console.error('Error submitting file:', error);
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
            onClick={() => navigate(`/student-dashboard/student-classes/${cid}/quiz/1`)}
          >
            <CardContent>
              <Typography>Quiz 1: JavaScript Basics - <strong>Due on 2024-12-10</strong></Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => navigate(`/student-dashboard/student-classes/${cid}/quiz/2`)}
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
          {homeworks.map((homework) => (
            <Card
              key={homework.id}
              variant="outlined"
              sx={{ marginBottom: 2, cursor: 'pointer' }}
            >
              <CardContent>
                <Typography>{homework.Title} - <strong>Due on {homework.DeadLine}</strong></Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => handleDialogOpen(homework)}
                >
                  Submit Homework
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
  
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Submit Homework</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            {selectedHomework?.Title}
          </Typography>
          <input type="file" onChange={handleFileChange} />
          <List>
            {records.map((record) => (
              <ListItem key={record.id}>
                <ListItemText  primary={extractFileName(record.HomeWorkAnswer)} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFileSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};  
export default ClassDetails;