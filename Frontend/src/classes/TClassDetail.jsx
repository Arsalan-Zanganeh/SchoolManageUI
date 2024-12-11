import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Container, 
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon, 
  ArrowBack as BackIcon, 
  Edit as EditIcon, 
  Publish as PublishIcon 
} from '@mui/icons-material';
import { useClass } from "../context/ClassContext";
import { useTeacher } from "../context/TeacherContext";

const TeacherClassDetail = () => {
  const { tcid } = useParams();
  const navigate = useNavigate();
  const { teacher } = useTeacher(); 
  const { classToken } = useClass(); 
  const teacherToken = teacher?.jwt; 
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openTime, setOpenTime] = useState("");
  const [durationHour, setDurationHour] = useState("");
  const [durationMinute, setDurationMinute] = useState("");

  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    Title: '', 
    Description: '', 
    DeadLine: '' 
  });
  const [assignments, setAssignments] = useState([]);
  const [publishedHomeworks, setPublishedHomeworks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false); // برای کنترل نمایش دیالوگ
  const [quizTitle, setQuizTitle] = useState(''); // برای ذخیره عنوان کوئیز
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  const handleQuizDialogOpen = () => setQuizDialogOpen(true);
  const handleQuizDialogClose = () => {
    setQuizDialogOpen(false);
    setQuizTitle('');
  };

  const handleQuizTitleChange = (e) => setQuizTitle(e.target.value);


  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedQuiz(null);
    setOpenTime("");
    setDurationHour("");
    setDurationMinute("");
  };

  const handleConfirmPublish = () => {
    if (selectedQuiz) {
      handlePublish({
        id: selectedQuiz.id,
        OpenTime: openTime,
        DurationHour: parseInt(durationHour, 10),
        DurationMinute: parseInt(durationMinute, 10)
      });
    }
    handleCloseModal();
  };

  const handlePublish = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/start_quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: data.id,
          OpenTime: data.OpenTime,
          DurationHour: data.DurationHour,
          DurationMinute: data.DurationMinute,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to publish quiz:", errorData);
        alert("Failed to publish quiz. Please try again.");
        return;
      }
  
      const result = await response.json();
      console.log(result);
  
      // محاسبه endTime بلافاصله بعد از دریافت نتیجه
      const openTime = new Date(result.OpenTime || data.OpenTime);
      const endTime = new Date(openTime.getTime());
      endTime.setHours(endTime.getHours() + data.DurationHour);
      endTime.setMinutes(endTime.getMinutes() + data.DurationMinute);
  
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === data.id
            ? {
                ...quiz,
                Is_Published: true,
                OpenTime: result.OpenTime || data.OpenTime,
                DurationHour: data.DurationHour,
                DurationMinute: data.DurationMinute,
                endTime: endTime.toISOString(), // مقدار endTime را اینجا ست می‌کنیم
              }
            : quiz
        )
      );
  
      alert("Quiz published successfully!");
    } catch (error) {
      console.error("An error occurred while publishing the quiz:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  
  
  
  // useEffect(() => {
  //   setQuizzes((prevQuizzes) =>
  //     prevQuizzes.map((quiz) => {
  //       const openTime = new Date(quiz.OpenTime);
  //       const endTime = new Date(openTime);
  //       endTime.setHours(openTime.getHours() + (quiz.DurationHour || 0));
  //       endTime.setMinutes(openTime.getMinutes() + (quiz.DurationMinute || 0));
  
  //       return {
  //         ...quiz,
  //         endTime, // زمان پایان به‌روز شده
  //       };
  //     })
  //   );
  // }, [quizzes]); // وابسته به تغییرات `quizzes`
  
  
  useEffect(() => {
    const fetchClasses = async () => {
      if (!teacherToken) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/teacher/classes/", {
          method: "GET",
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
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [teacherToken]);

  // Find class details effect (same as before)
  useEffect(() => {
    if (classes.length > 0) {
      const foundClass = classes.find((cls) => cls.id === parseInt(tcid));
      setClassDetails(foundClass);
    }
  }, [tcid, classes]);

  // Fetch homeworks effect (same as before)
  useEffect(() => {
    const fetchHomeworks = async () => {
      if (!teacherToken) {
        console.error('No token found');
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:8000/api/teacher-all-homeworks/", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
    
        if (response.ok) {
          const data = await response.json();
    
          const unpublishedAssignments = data.filter(hw => !hw.Is_Published).map(hw => ({
            ...hw, 
            id: hw.id
          }));
          const publishedAssignments = data.filter(hw => hw.Is_Published).map(hw => ({
            ...hw, 
            id: hw.id
          }));
    
          setAssignments(unpublishedAssignments);
          setPublishedHomeworks(publishedAssignments);
        } else {
          console.error('Failed to fetch homeworks');
        }
      } catch (error) {
        console.error('Error fetching homeworks:', error);
      }
    };
  
    fetchHomeworks();
  }, [teacherToken]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher_quizzes/', {
          method: 'GET',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          // محاسبه endTime برای هر کوئیز در لحظه دریافت
          const updatedQuizzes = data.map((quiz) => {
            const openTime = new Date(quiz.OpenTime);
            const endTime = new Date(openTime);
            endTime.setHours(endTime.getHours() + (quiz.DurationHour || 0));
            endTime.setMinutes(endTime.getMinutes() + (quiz.DurationMinute || 0));
            return {
              ...quiz,
              endTime: endTime.toISOString(),
            };
          });
          setQuizzes(updatedQuizzes);
        } else {
          console.error('Failed to fetch quizzes');
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoadingQuizzes(false);
      }
    };
    
  
    fetchQuizzes();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) => {
          const now = new Date();
          const openTime = new Date(quiz.OpenTime);
          const endTime = new Date(openTime);
          endTime.setHours(openTime.getHours() + quiz.DurationHour);
          endTime.setMinutes(openTime.getMinutes() + quiz.DurationMinute);
  
          return {
            ...quiz,
            isQuizEnded: now > endTime, // بررسی زمان پایان
          };
        })
      );
    }, 1000); // هر ثانیه بررسی شود
  
    return () => clearInterval(interval); // تمیز کردن تایمر هنگام خروج
  }, []);
  
  
  

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
    
    const homeworkToPublish = assignments.find(assignment => assignment.id === homeworkId);
  
    if (!teacherToken) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/teacher-publish-homework/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Homework_ID: homeworkId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) => prev.filter(assignment => assignment.id !== homeworkId));
        setPublishedHomeworks((prev) => [...prev, { ...homeworkToPublish, Is_Published: true }]);
        setMessage(`Homework "${homeworkToPublish.Title}" published successfully`);
        setTimeout(() => {
          setMessage('');
        }, 3000);
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
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h6" color="textSecondary">
          Loading class details...
        </Typography>
      </Container>
    );
  }
  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) {
      setMessage('Quiz title cannot be empty');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Title: quizTitle }),
      });
  
      if (response.ok) {
        const newQuiz = await response.json();
        console.log('Response from server:', newQuiz); 
        if (!newQuiz.OpenTime) {
          newQuiz.OpenTime = new Date().toISOString();
        }
        setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
        setQuizTitle('');
        handleQuizDialogClose();
        setMessage('Quiz created successfully');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to create quiz: ${errorData.error}`);
        console.error('Failed to create quiz', errorData);
      }
    } catch (error) {
      setMessage('An error occurred while creating quiz');
      console.error('Error creating quiz:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Container maxWidth="md" sx={{ py: 4 ,
      backgroundColor: '#DCE8FD' ,
      height : '100%',
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
      //   bottom: 0, 
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: '20px',
    }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 ,
         backgroundColor: '#DCE8FD' ,
         height : '100%',
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0, 
           justifyContent: 'center',
           alignItems: 'center',
           padding: '20px',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {classDetails.Topic}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Instructor: {classDetails.Teacher}
            </Typography>
          </Box>
          <IconButton 
            color="default" 
            onClick={() => navigate(-1)}
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider' 
            }}
          >
            <BackIcon />
          </IconButton>
        </Box>
  
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Session 1: {classDetails.Session1Day} - {classDetails.Session1Time}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Session 2: {classDetails.Session2Day} - {classDetails.Session2Time}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
  
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            mb: 3 
          }}
        >
          <Tab label="Quizzes" />
          <Tab label="Assignments" />
          <Tab label="Published Homeworks" />
        </Tabs>
  
{tabValue === 0 && (
  <Box>
    {loadingQuizzes ? (
      <Typography variant="body2" color="textSecondary" align="center">
        Loading quizzes...
      </Typography>
    ) : quizzes.length === 0 ? (
      <Typography variant="body2" color="textSecondary" align="center">
        No quizzes created yet
      </Typography>
    ) : (
      <Box 
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: 1,
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
          <Stack spacing={2}>
          {quizzes.map((quiz) => {
  const openTime = new Date(quiz.OpenTime);
  const endTime = new Date(openTime);
  endTime.setHours(openTime.getHours() + quiz.DurationHour);
  endTime.setMinutes(openTime.getMinutes() + quiz.DurationMinute);

  const now = new Date();
  const isQuizEnded = now > endTime;

  return (
    <Card key={quiz.id} variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body1">{quiz.Title}</Typography>
            <Typography variant="body2" color="textSecondary">
              Open Time: {openTime.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ends at: {endTime.toLocaleString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton
              color="primary"
              onClick={() => {
                navigate(`/teacher-dashboard/teacher-classes/${tcid}/quiz/${quiz.id}`);
              }}
            >
              <EditIcon />
            </IconButton>
            {isQuizEnded ? (
               <Button
               variant="contained"
               color="primary"
               onClick={() => navigate(`/teacher-dashboard/teacher-classes/${tcid}/quiz/${quiz.id}/results`)}
               sx={{ mt: 1 }}
             >
               View Results
             </Button>
           ) : (
             quiz.Is_Published ? (
               <Button
                 variant="contained"
                 color="secondary"
                 disabled
                 sx={{ backgroundColor: "#e0e0e0", color: "#666", marginLeft: 1 }}
               >
                 Published
               </Button>
             ) : (
               <Button
                 variant="contained"
                 color="primary"
                 onClick={() => handleOpenModal(quiz)}
                 sx={{ marginLeft: 1 }}
               >
                 Publish
               </Button>
             )
           )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
})}

      </Stack>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Publish Quiz</DialogTitle>
        <DialogContent>
          <TextField
            label="Open Time"
            type="datetime-local"
            fullWidth
            margin="dense"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
          />
          <TextField
            label="Duration (Hours)"
            type="number"
            fullWidth
            margin="dense"
            value={durationHour}
            onChange={(e) => setDurationHour(e.target.value)}
          />
          <TextField
            label="Duration (Minutes)"
            type="number"
            fullWidth
            margin="dense"
            value={durationMinute}
            onChange={(e) => setDurationMinute(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPublish} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    )}


            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              onClick={handleQuizDialogOpen}
              sx={{ mt: 2 }}
            >
              Manage Quizzes
            </Button>
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Stack spacing={2}>
              {assignments.map((assignment) => (
                <Card key={assignment.Homework_ID} variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1">{assignment.Title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Due on {assignment.DeadLine}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        startIcon={<PublishIcon />}
                        onClick={() => handlePublishHomework(assignment.id)}
                      >
                        Publish
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                fullWidth
              >
                Create New Assignment
              </Button>
            </Stack>
          </Box>
        )}
  
        {tabValue === 2 && (
          <Box 
            sx={{
              maxHeight: '400px',
              overflowY: 'auto',
              padding: 1,
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Stack spacing={2}>
              {publishedHomeworks.map((homework) => (
                <Card key={homework.Homework_ID} variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1">{homework.Title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Due on {homework.DeadLine}
                        </Typography>
                      </Box>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
  
      <Dialog 
        open={openDialog} 
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
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
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="Description"
            value={newAssignment.Description}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            name="DeadLine"
            value={newAssignment.DeadLine}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleAddAssignment} 
            color="primary" 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Assignment
          </Button>
        </DialogActions>
      </Dialog>
  
      <Dialog 
        open={quizDialogOpen} 
        onClose={handleQuizDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Create New Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            type="text"
            fullWidth
            value={quizTitle}
            onChange={handleQuizTitleChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuizDialogClose} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateQuiz} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
  
    </Container>
  );
  
};

export default TeacherClassDetail;