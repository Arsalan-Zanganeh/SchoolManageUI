import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Alert } from '@mui/material';

const SubmittedAssignmentsPage = () => {
  const { homeworkId } = useParams();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [grade, setGrade] = useState('');
  const [gradeError, setGradeError] = useState('');

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/discipline/teacher-watch-homework-answers/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ id: homeworkId }),
        });

        if (response.ok) {
          const data = await response.json();
          setSubmittedAssignments(data.filter(assignment => assignment.HomeWorkAnswer));
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch submitted assignments: ${errorData.error}`);
        }
      } catch (error) {
        setError('An error occurred while fetching submitted assignments');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedAssignments();
  }, [homeworkId]);

  const openDialog = (assignment) => {
    setCurrentAssignment(assignment);
    setGrade('');
    setGradeError('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentAssignment(null);
    setGradeError('');
  };

  const submitGrade = async () => {
    if (!currentAssignment) return;

    // Validate grade
    if (grade < 0 || grade > 100) {
      setGradeError('Grade must be between 0 and 100');
      return;
    }

    try {
      const payload = {
        Student: currentAssignment.Student,
        id: homeworkId,
        Grade: grade,
      };
      console.log('Submitting Grade:', payload);

      const response = await fetch('http://127.0.0.1:8000/discipline/teacher-addorchange-homework-grade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        const updatedAssignments = submittedAssignments.map((assignment) =>
          assignment.id === currentAssignment.id ? { ...assignment, Graded: true, Grade: grade } : assignment
        );
        setSubmittedAssignments(updatedAssignments);
        closeDialog();
      } else {
        console.error('Failed to submit grade:', responseData);
      }
    } catch (error) {
      console.error('An error occurred while submitting grade', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom>
        Submitted Assignments for Homework with ID: {homeworkId}
      </Typography>
      {submittedAssignments.length === 0 ? (
        <Typography variant="h5">No submissions found!</Typography>
      ) : (
        <Box>
          {submittedAssignments.map((assignment) => (
            <Card key={assignment.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{width:'30%'}}>
                  {assignment.Student_firstname} {assignment.Student_lastname} ({assignment.Student_National_ID})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5%', width: '60%', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                  <a
                      href={assignment.HomeWorkAnswer}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (assignment.HomeWorkAnswer) {window.open(`http://127.0.0.1:8000/api${assignment.HomeWorkAnswer}`, '_blank');}
                        else {console.error('File path not available');}
                      }}
                    >
                      View Answer
                    </a>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Sending Time:</strong> {new Date(assignment.SendingTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Graded:</strong> {assignment.Graded ? `Yes, Grade: ${assignment.Grade}` : 'No'}
                  </Typography>
                </Box>
                <Button variant="contained" color="primary" onClick={() => openDialog(assignment)} sx={{width:'10%'}}>
                  Grade
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Grade Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the grade for the assignment submitted by Student ID: {currentAssignment?.Student}
          </DialogContentText>
          {gradeError && <Alert severity="error">{gradeError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Grade"
            type="number"
            fullWidth
            variant="outlined"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={submitGrade} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmittedAssignmentsPage;
