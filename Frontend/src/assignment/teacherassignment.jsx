import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

const AssignmentDetail = () => {
  const { tcid, assignmentId } = useParams(); // دریافت tcid و assignmentId از پارامترهای URL
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]); // لیست ارسال‌ها

  useEffect(() => {
    // فرض کنید داده‌ها از API دریافت می‌شود
    const fetchAssignmentDetails = async () => {
      // اینجا باید جزئیات تکلیف و ارسال‌های دانش‌آموزان را از API دریافت کنید
      const mockAssignment = {
        title: 'Assignment 1: Portfolio Website',
        dueDate: '2024-12-05',
        description: 'Create a portfolio website using React.',
        submissions: [
          { studentName: 'John Doe', file: 'portfolio_john.pdf' },
          { studentName: 'Jane Smith', file: 'portfolio_jane.pdf' },
        ],
      };

      setAssignment(mockAssignment);
      setSubmissions(mockAssignment.submissions);
    };

    fetchAssignmentDetails();
  }, [assignmentId]);

  if (!assignment) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Loading assignment details...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '800px', margin: 'auto' }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, backgroundColor: 'secondary.light' }}>
        <Typography variant="h4" color="secondary" gutterBottom>
          {assignment.title}
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="body1">
          <strong>Due Date:</strong> {assignment.dueDate}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          <strong>Description:</strong> {assignment.description}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={() => navigate(-1)}
        >
          Back to Class
        </Button>
      </Paper>

      <Typography variant="h5" color="secondary" sx={{ marginBottom: 2 }}>
        Submitted Files:
      </Typography>

      <List>
        {submissions.map((submission, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${submission.studentName} - ${submission.file}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AssignmentDetail;
