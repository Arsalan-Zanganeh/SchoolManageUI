import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Paper, Button, Tabs, Tab, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, Container } from '@mui/material';
import { useClass } from "../context/ClassContext";
import { useTeacher } from "../context/TeacherContext";

const TeacherClassDetail = () => {
  const { tcid } = useParams();
  const navigate = useNavigate();
  const { teacher } = useTeacher(); 
  const { classToken, loginClass } = useClass(); 
  const teacherToken = teacher?.jwt; 
  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({id: '', Title: '', Description: '', DeadLine: '' });
  const [assignments, setAssignments] = useState([]);
  const [publishedHomeworks, setPublishedHomeworks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      console.log('Fetching classes with token:', teacherToken); 
      if (!teacherToken) {
        console.error('No token found');
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/teacher/classes/", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        console.error('Failed to fetch classes');
      }
    };

    fetchClasses();
  }, [teacherToken]);

  useEffect(() => {
    if (classes.length > 0) {
      const foundClass = classes.find((cls) => cls.id === parseInt(tcid));
      setClassDetails(foundClass);
    }
  }, [tcid, classes]);
  useEffect(() => {
    const fetchHomeworks = async () => {
      console.log('Fetching homeworks with token:', teacherToken);
      
      if (!teacherToken) {
        console.error('No token found');
        return;
      }
  
      const response = await fetch("http://127.0.0.1:8000/api/teacher-all-homeworks/", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // حالا می‌توانید ID هر تکلیف را استخراج کنید و برای هر تکلیف ID را ذخیره کنید
        const unpublishedAssignments = data.filter(hw => !hw.Is_Published).map(hw => ({
          ...hw, id: hw.id // فرض بر این است که id در data موجود است
        }));
        const publishedAssignments = data.filter(hw => hw.Is_Published).map(hw => ({
          ...hw, id: hw.id
        }));
  
        setAssignments(unpublishedAssignments);
        setPublishedHomeworks(publishedAssignments);
      } else {
        console.error('Failed to fetch homeworks');
      }
    };
  
    fetchHomeworks();
  }, [teacherToken]); // توجه داشته باشید که وابستگی به teacherToken اضافه شده است
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignment = async () => {
    setLoading(true);
    setMessage('');

    if (!teacherToken) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/teacher-add-homework/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`, // Include the token
        },
        credentials: 'include',
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) => [...prev, data]);
        setOpenDialog(false);
        setNewAssignment({ Title: '', Description: '', DeadLine: '' });
        setMessage('Homework added successfully');
      } else {
        setMessage('Failed to add homework');
      }
    } catch (error) {
      setMessage('An error occurred while adding homework');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishHomework = async (homeworkId) => {
    setLoading(true);
    setMessage('');

    if (!teacherToken) {
      console.error('No token found');
      return;
    }

    console.log('Publishing Homework ID (before request):', homeworkId); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/teacher-publish-homework/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Homework_ID: homeworkId }), // Ensure JSON.stringify is correctly used
      });

      if (response.ok) {
        const data = await response.json(); // Fetch response data
        setAssignments((prev) => prev.filter(assignment => assignment.Homework_ID !== homeworkId));
        setPublishedHomeworks((prev) => [...prev, data]); // Ensure published homeworks are updated correctly
        setMessage('Homework published successfully');
        console.log('Published Homework ID (after request):', homeworkId); // Log after publishing
      } else {
        const errorData = await response.json();
        setMessage(`Failed to publish homework: ${errorData.error}`);
        console.error('Failed to publish homework', errorData);
      }
    } catch (error) {
      setMessage('An error occurred while publishing homework');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!classDetails) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Loading class details...
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ border: '2px solid blue', borderRadius: '8px', padding: 2, mt: 5 }}>
      <Box sx={{ mx: 'auto' }}>
        <Typography variant="h4" color="secondary" gutterBottom>
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
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{ marginTop: 2 }}
        >
          Back
        </Button>
      </Box>
  
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Teacher class details tabs"
        sx={{ marginBottom: 3, borderBottom: 1, borderColor: 'divider' }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Quizzes" sx={{ fontWeight: 'bold' }} />
        <Tab label="Assignments" sx={{ fontWeight: 'bold' }} />
        <Tab label="Published Homeworks" sx={{ fontWeight: 'bold' }} />
      </Tabs>
  
      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" color="secondary" sx={{ marginBottom: 2 }}>
            Recent Quizzes
          </Typography>
          <Card
            variant="outlined"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => navigate(`/teacher-dashboard/class/${tcid}/quiz/1`)}
          >
            <CardContent>
              <Typography>Quiz 1: JavaScript Basics - <strong>Due on 2024-12-10</strong></Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => navigate(`/teacher-dashboard/class/${tcid}/quiz/2`)}
          >
            <CardContent>
              <Typography>Quiz 2: React Fundamentals - <strong>Due on 2024-12-15</strong></Typography>
            </CardContent>
          </Card>
        </Box>
      )}
  
      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" color="secondary" sx={{ marginBottom: 2 }}>
            Recent Assignments
          </Typography>
          {assignments.map((assignment) => (
            <Card
              key={assignment.Homework_ID}
              variant="outlined"
              sx={{ marginBottom: 2, cursor: 'pointer' }}
            >
              <CardContent>
                <Typography>{assignment.Title} - <strong>Due on {assignment.DeadLine}</strong></Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePublishHomework(
                    assignment.id)} // Pass Homework_ID on click
                  sx={{ mt: 1 }}
                >
                  Publish
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ marginTop: 2 }}
          >
            Create New Assignment
          </Button>
        </Box>
      )}
  
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" color="secondary" sx={{ marginBottom: 2 }}>
            Published Homeworks
          </Typography>
          {publishedHomeworks.map((homework) => (
            <Card
              key={homework.Homework_ID}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            >
              <CardContent>
                <Typography>{homework.Title} - <strong>Due on {homework.DeadLine}</strong></Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
  
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="Title"
            value={newAssignment.Title}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="Description"
            value={newAssignment.Description}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            name="DeadLine"
            value={newAssignment.DeadLine}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAssignment} color="primary">
            Add Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
  
};  
export default TeacherClassDetail;