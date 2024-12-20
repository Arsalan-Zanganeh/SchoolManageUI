import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Menu , Typography, Button, Tabs, Tab, Card, CardContent, AppBar, Toolbar,
  Grid, Divider, Paper, Dialog, DialogTitle, DialogContent, IconButton,Drawer,ListItemIcon,
  DialogActions, List, ListItem, ListItemText, Container, useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  ArrowBack as BackIcon, 
  Edit as EditIcon, 
  Publish as PublishIcon,
  Delete as DeleteIcon,
  Quiz,
  Assessment,
  People,
  Send,
  HomeWork,
  EditNote
} from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu'; 


import AttendanceStatus from "../Attendence-stu";


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
  list: {
    width: '95%',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px',
},
listItemHighlight: {
  padding: '20px',
},
previewTextGray: {
    color: '#C8C6C6', 
},
previewTextBlack: {
    color: '#000', 
},
dialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
},
dialogContent: {
    padding: '16px',
},
dateText: {
    fontWeight: 'bold', 
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

const ClassDetails = () => {
  const { cid } = useParams(); 
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]); 
  const [classDetails, setClassDetails] = useState(null); 
  const [tabValue, setTabValue] = useState(0); 
  const [homeworks, setHomeworks] = useState([]); 
  const [quizzes, setQuizzes] = useState([]); 
  const [selectedHomework, setSelectedHomework] = useState(null); 
  const [records, setRecords] = useState([]); 
  const [openDialog, setOpenDialog] = useState(false); 
  const [file, setFile] = useState(null); 
  const [finishedQuizzes, setFinishedQuizzes] = useState([]);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop ? { variant: 'permanent', open: true } : { open: sidebarOpen, onClose: toggleSidebar };



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

      const fetchQuizzes = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/student_quizzes/", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setQuizzes(data);
          } else {
            console.error('Failed to fetch quizzes');
          }
        } catch (error) {
          console.error('Error fetching quizzes:', error);
        }
      };

      fetchHomeworks();
      fetchQuizzes();
    }
  }, [classDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuizzes((prevQuizzes) => {
        const now = new Date();
        return prevQuizzes.map((quiz) => {
          const openTime = new Date(quiz.OpenTime);
          const endTime = new Date(openTime);
          endTime.setHours(endTime.getHours() + quiz.DurationHour);
          endTime.setMinutes(endTime.getMinutes() + quiz.DurationMinute);

          const isQuizOpen = now >= openTime && now <= endTime;
          const isQuizEnded = now > endTime;

          return {
            ...quiz,
            isQuizOpen,
            isQuizEnded,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQuizStatuses = async () => {
      const openQuizzes = quizzes.filter((quiz) => quiz.isQuizOpen || quiz.isQuizEnded === false);

      if (openQuizzes.length === 0) {
        return;
      }

      const statuses = await Promise.all(
        openQuizzes.map(async (quiz) => {
          const isFinished = await checkQuizStatus(quiz.id);
          return { id: quiz.id, finished: isFinished };
        })
      );

      setFinishedQuizzes((prev) => {
        const prevMap = new Map(prev.map(obj => [obj.id, obj.finished]));
        statuses.forEach(s => {
          prevMap.set(s.id, s.finished);
        });
        return Array.from(prevMap, ([id, finished]) => ({id, finished}));
      });
    };

    if (quizzes.length > 0) {
      fetchQuizStatuses();
    }
  }, [quizzes]); 

  const checkQuizStatus = async (quizId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/student-quiz-finished-boolean/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ QuizTeacher_ID: quizId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.boolean === true;
      } else {
        console.error("Failed to check quiz status.");
        return false;
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
      return false;
    }
  };

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
        headers: {},
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
  
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    if (!classDetails || !classDetails.Teacher) return;
  
    const teacherId = classDetails.Teacher;
    // از اینجا به بعد مطمئن هستیم که teacherId تعریف شده است
    fetch('http://127.0.0.1:8000/api/othersides-watch-teacher-info/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ id: teacherId })
    })
      .then(response => response.json())
      .then(data => {
        const fullName = data.first_name + ' ' + data.last_name;
        setTeacherName(fullName);
      })
      .catch(err => {
        console.error("Error fetching teacher info:", err);
      });
  }, [classDetails]);
  

  if (!classDetails) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          background: 'linear-gradient(45deg, #3f51b5 30%, #1a237e 90%)' 
        }}
      >
        <Typography variant="h6" align="center" color="#fff">
          Loading class details...
        </Typography>
      </Box>
    );
  }
  

  return (
    <ThemeProvider theme={theme}>
    <Box 
    sx=
    {{
      position: { xs: "relative", sm: "absolute" },
      top: 0,
      left: { xs: "10px", sm: "240px" },
      right: { xs: "20px", sm: "20px" },
      width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
      maxWidth: { xs: "100%", sm: "1600px" },
      margin: "0 auto",
      minHeight: "100vh",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden", 
  }}
    >
     <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main, zIndex: theme.zIndex.drawer + 1 }}>
  <Toolbar>
    <Grid container alignItems="center" justifyContent="space-between">
      {!isDesktop && (
         <Grid item sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={toggleSidebar}
                    sx={{
                      padding: '8px', 
                      '& svg': { fontSize: '1.5rem' }, 
                    }}
                  >
                    <MenuIcon sx={{ color: '#fff' }}/>
                  </IconButton>
        </Grid>
      )}
      <Grid item xs sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
          {`${classDetails?.Topic || 'Class Details'}`}
        </Typography>
      </Grid>
    </Grid>
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
<Box
  sx={{
    backgroundColor: '#DCE8FD',
    padding: { xs: '20px', sm: '20px' },
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  }}
>
  {/* ردیف شامل عنوان و دکمه بازگشت */}
  <Grid container alignItems="center" sx={{ width: '100%' }}>
    {/* ستون سمت چپ خالی برای ایجاد فضای متقارن */}
    <Grid item xs={2} sm={2} />

    {/* ستون میانی - عنوان */}
    <Grid item xs={8} sm={8}>
      <Typography
        variant="h5"
        color="primary"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          textAlign: 'center',
        }}
      >
        {classDetails.Topic}
      </Typography>
    </Grid>

    {/* ستون سمت راست - آیکن بازگشت */}
    <Grid item xs={2} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton
  onClick={() => navigate('/student-dashboard')}
  sx={{
          padding: { xs: '6px', sm: '8px' },
          '& svg': { fontSize: { xs: '1.2rem', sm: '1.5rem' } },
          backgroundColor: '#fff',
          color: 'primary.main',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#f0f0f0',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <BackIcon />
      </IconButton>
    </Grid>
  </Grid>

  <Typography
    variant="subtitle1"
    color="textSecondary"
    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, textAlign: 'center' }}
  >
    Instructor: {teacherName || 'Loading...'}
  </Typography>

  <Grid container spacing={2} sx={{ width: '100%' }}>
    <Grid item xs={12} sm={6}>
      <Paper
        elevation={2}
        sx={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Session 1: {classDetails.Session1Day} - {classDetails.Session1Time}
        </Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Paper
        elevation={2}
        sx={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Session 2: {classDetails.Session2Day} - {classDetails.Session2Time}
        </Typography>
      </Paper>
    </Grid>
  </Grid>
</Box>






  
        {/* <Grid container spacing={2} sx={{ mb: 2 }}>
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
        </Grid> */}
    
        {tabValue === 0 && (
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              sx={{ marginBottom: 2, fontWeight: 'bold' }}
            >
              Recent Quizzes
            </Typography>
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: 2,
              }}
            >
             {quizzes.length > 0 ? (
               quizzes.map((quiz) => {
                 const quizStatus = finishedQuizzes.find((q) => q.id === quiz.id);
                 const isQuizFinished = quizStatus ? quizStatus.finished : false;

                 const isQuizOpen = quiz.isQuizOpen;
                 const isQuizEnded = quiz.isQuizEnded;

                 const openTime = new Date(quiz.OpenTime);
                 const endTime = new Date(openTime);
                 endTime.setHours(endTime.getHours() + quiz.DurationHour);
                 endTime.setMinutes(endTime.getMinutes() + quiz.DurationMinute);

                 return (
                   <Card
                     key={quiz.id}
                     variant="outlined"
                     sx={{
                       marginBottom: 2,
                       transition: '0.3s',
                       '&:hover': {
                         boxShadow: isQuizOpen && !isQuizFinished ? 3 : 1,
                         backgroundColor: isQuizOpen && !isQuizFinished ? '#f0f0f0' : 'transparent',
                       },
                     }}
                   >
                     <CardContent>
                       <Typography variant="h6" fontWeight="bold" color="text.primary">
                         {quiz.Title}
                       </Typography>
                       <Typography variant="body2" color="textSecondary">
                         Opens on: {openTime.toLocaleString()}
                       </Typography>
                       <Typography variant="body2" color="textSecondary">
                         Ends on: {endTime.toLocaleString()}
                       </Typography>
                       <Typography variant="body2" color="textSecondary">
                         Duration: {quiz.DurationHour} hour(s) and {quiz.DurationMinute} minute(s)
                       </Typography>

                       {isQuizEnded ? (
                         <Button
                           variant="contained"
                           color="primary"
                           sx={{ mt: 1 }}
                           onClick={() => {
                             navigate(`/student-dashboard/student-classes/${cid}/quiz/${quiz.id}/results`);
                           }}
                         >
                           Show Results
                         </Button>
                       ) : isQuizFinished ? (
                         <>
                           <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                             You have already finished this quiz.
                           </Typography>
                           <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                             Results will be available on: {endTime.toLocaleString()}
                           </Typography>
                         </>
                       ) : isQuizOpen ? (
                         <Button
                           variant="contained"
                           color="primary"
                           sx={{ mt: 1 }}
                           onClick={() => {
                             const quizEnd = new Date(openTime);
                             quizEnd.setHours(quizEnd.getHours() + quiz.DurationHour);
                             quizEnd.setMinutes(quizEnd.getMinutes() + quiz.DurationMinute);

                             navigate(`/student-dashboard/student-classes/${cid}/quiz/${quiz.id}`, {
                               state: { quizEndTime: quizEnd.toISOString(), cid },
                             });
                           }}
                         >
                           Start Quiz
                         </Button>
                       ) : (
                         <Button variant="contained" color="secondary" sx={{ mt: 1 }} disabled>
                           Quiz Not Started
                         </Button>
                       )}
                     </CardContent>
                   </Card>
                 );
               })
             ) : (
               <Typography variant="body1" color="textSecondary">
                 No quizzes available.
               </Typography>
             )}

            </Box>
          </Box>
        )}
    
        {tabValue === 1 && (
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              p:2,
              boxShadow:1
            }}
          >
            <Typography variant="h5" color="primary" sx={{ marginBottom: 2, fontWeight:'bold' }}>
              Recent Assignments
            </Typography>
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: 2,
              }}
            >
              {homeworks.filter(homework => homework.Is_Published).map((homework) => (
                <Card
                  key={homework.id}
                  variant="outlined"
                  sx={{
                    marginBottom: 2,
                    cursor: 'pointer',
                    transition:'0.3s', 
                    '&:hover':{ boxShadow:3, backgroundColor:'#f0f0f0'} 
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {homework.Title}
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mb:1 }}>
                      Due on: {homework.DeadLine}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => handleDialogOpen(homework)}
                      startIcon={<Send />}
                    >
                      Submit Homework
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <TabPanel value={tabValue} index={2}>
          <AttendanceStatus Topic={classDetails.Topic}/>
        </TabPanel>
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>Submit Homework</DialogTitle>
          <DialogContent>
            <Typography variant="h6" fontWeight="bold" sx={{mb:2}}>
              {selectedHomework?.Title}
            </Typography>
            <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
            <List>
              {records.map((record) => (
                <ListItem key={record.id}>
                  <ListItemText primary={extractFileName(record.HomeWorkAnswer)} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleFileSubmit} color="primary" variant="contained" startIcon={<Send />}>
              Submit
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
        <People />
      </ListItemIcon>
      <ListItemText primary="Attendence" />
    </ListItem>
    <ListItem
  button
  onClick={() => navigate('/student-dashboard')}
  sx={{
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      transition: 'background-color 0.3s',
    },
    cursor: 'pointer',
    borderRadius: 1,
    padding: theme.spacing(1),
  }}
>
  <ListItemIcon sx={{ color: '#fff' }}>
    <BackIcon />
  </ListItemIcon>
  <ListItemText primary="Back to Dashboard" />
</ListItem>

    
  </List>
    </Drawer> 
    </Box> 
    </Box>       
    </ThemeProvider>
  );
}
export default ClassDetails;
