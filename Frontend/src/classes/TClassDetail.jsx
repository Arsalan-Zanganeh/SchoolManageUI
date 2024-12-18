import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  Card, 
  Drawer,
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
  Publish as PublishIcon,
  Delete as DeleteIcon,
  Quiz,
  Assessment,
  People,
  HomeWork,
  EditNote
} from '@mui/icons-material';
import { useClass } from "../context/ClassContext";
import { useTeacher } from "../context/TeacherContext";
import { useMediaQuery } from '@mui/material';
import {Menu} from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import Attendance from "../Attendence";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const styles = {
  list: {
      width: '100%',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '8px',
  },
  listItem: {
      borderBottom: '1px solid #ddd',
      padding: '16px',
      cursor: 'pointer',
      '&:hover': {
          backgroundColor: '#0036AB',
      },
  },
  listItemText: {
      fontWeight: 500,
  },
  previewText: {
      color: '#555',
  },
  dialogTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
  },
  dialogContent: {
      padding: '16px',
  },
  dateText: {
      marginRight: '16px',
      color: '#aaa',
  },
  list: {
    width: '95%',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px',
},
listItem: {
    borderBottom: '1px solid #ddd',
    padding: '16px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f1f1f1',
    },
},
listItemHighlight: {
  padding: '20px',
},
listItemText: {
    fontWeight: 500,
},
previewTextGray: {
    color: '#C8C6C6', // Gray for seen notifications
},
previewTextBlack: {
    color: '#000', // Black for unseen notifications
},
dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
},
dialogContent: {
    padding: '16px',
},
dateText: {
    fontWeight: 'bold', // Bold date
    marginRight: '16px',
    color: '#aaa',
},
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#0036AB',
      drawer: '#0051FF',
    },
    text: {
      secondary: '#757575',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false); // برای کنترل نمایش دیالوگ
  const [quizTitle, setQuizTitle] = useState(''); // برای ذخیره عنوان کوئیز
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop ? { variant: 'permanent', open: true } : { open: sidebarOpen, onClose: toggleSidebar };

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
  
  const handleDeleteAssignment = async (HomeworkID) => {
    setLoading(true);
    setMessage('');
  
    const homeworkToDelete = assignments.find((assignment) => assignment.id === HomeworkID);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/teacher-delete-homework/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherToken}`,  // Include token if necessary
        },
        credentials: 'include',
        body: JSON.stringify({
          Homework_ID: HomeworkID
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== HomeworkID));
        setMessage(`Homework "${homeworkToDelete.Title}" deleted successfully!`);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete homework: ${errorData.error}`);
        console.error('Failed to delete homework', errorData);
      }
    } catch (error) {
      setMessage('An error occurred while deleting homework');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main, zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {`${classDetails.Topic}`}
            </Typography>
          </Toolbar>
        </AppBar>
      <Toolbar/>
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
    <Box component="main" sx={{ flexGrow: 1, mt : 4 }}>
    <Container maxWidth="">
    <Paper elevation={3} sx={{ p: 3, mb: 3 ,
         backgroundColor: '#DCE8FD' ,
         height : '100%',
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
                      <Box display="flex" flexDirection="row" gap="15px">
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          startIcon={<PublishIcon />}
                          onClick={() => handlePublishHomework(assignment.id)}
                        >
                          Publish
                        </Button>
                        <IconButton color="primary" onClick={() => handleDeleteAssignment(assignment.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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
          <IconButton color="primary" onClick={() => handleDeleteAssignment(homework.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  ))}
</Stack>

          </Box>
        )}
        <TabPanel value={tabValue} index={3}>
        <Attendance/>
          </TabPanel>
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
    </Box>
    <Drawer anchor='left' {...drawerProps} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.drawer, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
    <Toolbar />
  <List>
    <ListItem button onClick={() => setTabValue(0)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.primary.light, 
            transition: 'background-color 0.3s', 
          },
          cursor: 'pointer', 
          borderRadius: 1, 
          padding: theme.spacing(1), 
        }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <Quiz />
      </ListItemIcon>
      <ListItemText primary="Quizzes" />
    </ListItem>
    <ListItem button onClick={() => setTabValue(1)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.primary.light, 
            transition: 'background-color 0.3s', 
          },
          cursor: 'pointer', 
          borderRadius: 1, 
          padding: theme.spacing(1), 
        }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <EditNote />
      </ListItemIcon>
      <ListItemText primary="Assignments" />
    </ListItem>
    <ListItem button onClick={() => setTabValue(2)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.primary.light, 
            transition: 'background-color 0.3s', 
          },
          cursor: 'pointer', 
          borderRadius: 1, 
          padding: theme.spacing(1), 
        }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <BusinessIcon />
      </ListItemIcon>
      <ListItemText primary="Published Homeworks" />
    </ListItem>
    <ListItem button onClick={() => setTabValue(3)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.primary.light, 
            transition: 'background-color 0.3s', 
          },
          cursor: 'pointer', 
          borderRadius: 1, 
          padding: theme.spacing(1), 
        }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <People />
      </ListItemIcon>
      <ListItemText primary="Attendence" />
    </ListItem>
    <ListItem button onClick={() => navigate(-1)}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.primary.light, 
            transition: 'background-color 0.3s', 
          },
          cursor: 'pointer', 
          borderRadius: 1, 
          padding: theme.spacing(1), 
        }}>
      <ListItemIcon sx={{ color: '#fff' }}>
        <BackIcon />
      </ListItemIcon>
      <ListItemText primary="Back to Dashboard" />
    </ListItem>
    
  </List>
    </Drawer> 
    </Box>  
    {!isDesktop && (
      <Box sx={{ position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
        <Button variant="contained" color="primary" onClick={toggleSidebar}>
          <Menu />
        </Button>
      </Box>
    )}
    </Box>       
  );
  
};

export default TeacherClassDetail;