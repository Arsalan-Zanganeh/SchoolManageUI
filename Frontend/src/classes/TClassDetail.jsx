import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Paper, Button, Tabs, Tab, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const TeacherClassDetail = () => {
  const { tcid } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0); // وضعیت تب فعال
  const [openDialog, setOpenDialog] = useState(false); // وضعیت نمایش پاپ‌آپ
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' }); // اطلاعات تکلیف جدید
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Assignment 1: Create a portfolio website', dueDate: '2024-12-05' },
    { id: 2, title: 'Assignment 2: Build a React application', dueDate: '2024-12-12' }
  ]); // لیست تکالیف موجود

  // گرفتن لیست کلاس‌ها
  useEffect(() => {
    const fetchClasses = async () => {
      const response = await fetch("http://127.0.0.1:8000/teacher/classes/", {
        headers: {
          'Content-Type': 'application/json',
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
  }, []);

  // پیدا کردن کلاس مشخص شده با tcid
  useEffect(() => {
    if (classes.length > 0) {
      const foundClass = classes.find((cls) => cls.id === parseInt(tcid));
      setClassDetails(foundClass);
    }
  }, [tcid, classes]);

  // تغییر تب فعال
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // باز کردن پاپ‌آپ
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // بستن پاپ‌آپ
  const handleClose = () => {
    setOpenDialog(false);
  };

  // تغییر مقدار ورودی‌های تکلیف جدید
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  // افزودن تکلیف جدید به لیست
  const handleAddAssignment = () => {
    const newId = assignments.length + 1;
    const newAssignmentData = { ...newAssignment, id: newId };
    setAssignments((prev) => [...prev, newAssignmentData]);
    setOpenDialog(false);
    setNewAssignment({ title: '', description: '', dueDate: '' }); // پاک کردن فرم
  };

  if (!classDetails) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Loading class details...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '800px', margin: 'auto' }}>
      {/* اطلاعات کلاس به صورت کارت */}
      <Paper
        elevation={3}
        sx={{ padding: 2, marginBottom: 3, backgroundColor: 'secondary.light', borderRadius: 2 }}
      >
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
      </Paper>

      {/* تب‌های کوئیز و تکالیف */}
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
      </Tabs>

      {/* محتوای هر تب */}
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
              key={assignment.id}
              variant="outlined"
              sx={{ marginBottom: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/teacher-dashboard/class/${tcid}/assignment/${assignment.id}`)}
            >
              <CardContent>
                <Typography>{assignment.title} - <strong>Due on {assignment.dueDate}</strong></Typography>
              </CardContent>
            </Card>
          ))}
          {/* دکمه برای ساخت تکلیف جدید */}
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

      {/* پاپ‌آپ ساخت تکلیف جدید */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={newAssignment.title}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={newAssignment.description}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            name="dueDate"
            value={newAssignment.dueDate}
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
    </Box>
  );
};

export default TeacherClassDetail;