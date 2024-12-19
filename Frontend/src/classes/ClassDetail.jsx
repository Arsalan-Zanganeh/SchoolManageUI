import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Tabs, Tab, Card, CardContent,
  Grid, Divider, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Container
} from '@mui/material';
import { Assignment, Quiz, ArrowBack, People,Send } from '@mui/icons-material';
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
    <Box
      sx={{
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
      }}
    >
      <Container maxWidth="lg"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          boxShadow: 3,
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: { xs: 1, md: 2}, 
            marginBottom: 3, 
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(5px)',
          }}
        >
          <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
            {classDetails.Topic}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Instructor:</strong> {classDetails.Teacher}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Session 1:</strong> {classDetails.Session1Day} - {classDetails.Session1Time}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Session 2:</strong> {classDetails.Session2Day} - {classDetails.Session2Time}
              </Typography>
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate("/student-dashboard/")} 
            startIcon={<ArrowBack />}
            sx={{ marginTop: 2 }}
          >
            Back To Dashboard
          </Button>
        </Paper>
    
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="Class details tabs" 
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ 
            marginBottom: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 1,
          }}
          textColor="primary" 
          indicatorColor="primary"
        >
          <Tab label="Quizzes" sx={{ fontWeight: 'bold', minWidth: 120 }} icon={<Quiz />} iconPosition="start"/>
          <Tab label="Assignments" sx={{ fontWeight: 'bold', minWidth: 120 }} icon={<Assignment />} iconPosition="start"/>
          <Tab label="Attendence" sx={{ fontWeight: 'bold', minWidth: 120 }} icon={<People />} iconPosition="start"/>

        </Tabs>
    
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
              {homeworks.map((homework) => (
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
  );
};  

export default ClassDetails;
