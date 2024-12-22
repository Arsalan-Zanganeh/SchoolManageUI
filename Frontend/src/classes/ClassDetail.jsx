import React, { useEffect, useState  , useCallback} from 'react';
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
  PlayArrow,
  InsertDriveFile,
  Send,
  HomeWork,
  EditNote
} from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu'; 
import ChatIcon from '@mui/icons-material/Chat';
import BookIcon from '@mui/icons-material/Book';

import AppWrapper from './chatpage';

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
  const [name, setName] = useState("Loading...");
  const currentDate = new Date().getTime;
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop ? { variant: 'permanent', open: true } : { open: sidebarOpen, onClose: toggleSidebar };

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  
  const [educationalVideos, setEducationalVideos] = useState([]);
  const [educationalFiles, setEducationalFiles] = useState([]);


  const convertToEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];  // Extract video ID
    return `https://www.youtube.com/embed/${videoId}`;  // Embed URL format
};

  const handleOpenVideoFullScreen = (url) => {
      const embedUrl = convertToEmbedUrl(url);  // Convert to embed URL if it's a YouTube URL
      setSelectedVideoUrl(embedUrl);  // Set the embed URL
      setOpenVideoModal(true);  // Open the modal to show the video
  };


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

  const [studentId, setStudentId] = useState(null); 

const fetchStudentData = useCallback(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/student/user/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const studentData = await response.json();
      setStudentId(studentData.id); 
      setName(studentData.first_name);
      setLastName(studentData.last_name);
    } else {
      console.error("Failed to fetch student data");
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
}, []);
useEffect(() => {
  fetchStudentData();
}, [fetchStudentData]);


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

       // Fetch educational videos and files for the class
       const fetchEducationalVideos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/discipline/student-watchvid-EC/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched educational videos:", data);  // Log the entire response
    
                setEducationalVideos(data);
            } else {
                console.error('Failed to fetch educational videos');
            }
        } catch (error) {
            console.error('Error fetching educational videos:', error);
        }
    };
    

      const fetchEducationalFiles = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/discipline/student-watchfile-EC/", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data); // Debug: Check the fetched data structure
            setEducationalFiles(data);
          } else {
            console.error('Failed to fetch educational files');
          }
        } catch (error) {
          console.error('Error fetching educational files:', error);
        }
      };
      

      fetchEducationalVideos();
      fetchEducationalFiles();


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
  
  const getGradeForStudent = (studentId, recs) => {
    const rec = recs.find(record => record.Student === studentId);
    return rec && rec.Grade !== null ? `${rec.Grade}` : 'Not graded!';
  };

  const getUploadedFileForStudent = (studentId, recs) => {
    const rec = recs.find(record => record.Student === studentId);
    return rec && rec.HomeWorkAnswer ? rec.HomeWorkAnswer : 'Not uploaded any file!';
  };

  const fileUrl = getUploadedFileForStudent(studentId, records);

  const removeMediaPrefix = (fileUrl) => {
    return fileUrl.replace('/media/profile_image/', '');
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
    <ThemeProvider theme={theme}>
    <Box 
    sx=
    {{
      position: { xs: "relative", sm: "absolute" },
      top: 0,
      left: { xs: "10px", sm: "240px" },
      right: { xs: "20px", sm: "20px" },
      // width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
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
            <Typography variant="h5" color="primary" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
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
                      Submit or view homework / View grade
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

      <TabPanel value={tabValue} index={4}>
                        <AppWrapper onBack={() => handleTabChange(0)} /> {/* ارسال تابع بک */}
      </TabPanel>
{tabValue === 3 && (
  <Box sx={{ padding: 2 }}>
    {/* Container for Files and Videos */}
    <Grid container spacing={2}>
      {/* Left Side: Educational Files */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          Educational Files
        </Typography>
        <Box sx={{
          borderRight: '2px solid #ccc', // Add a border between the two sides
          height: '100%', // Make sure the border stretches to the full height
          paddingRight: 2, // Add some padding on the right of this section
        }}>
          <Grid container spacing={2}>
            {educationalFiles.length > 0 ? (
              educationalFiles.map((file) => {
                // Debugging: Log each file to ensure we have the correct data
                console.log('File Data:', file); // Check the data structure

                return (
                  <Grid item xs={6} sm={4} md={3} key={file.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        {/* File Icon */}
                        <InsertDriveFile sx={{ fontSize: 40, mb: 1 }} />
                        
                        {/* Display the file name under the icon */}
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {file.Title} {/* Fixed here to match the correct field from API */}
                        </Typography>
                        
                        {/* Button to download the file */}
                        <Button
                          variant="contained"
                          color="primary"
                          size="small" // Make button smaller
                          onClick={() => {
                            if (file.file) {
                              const fileUrl = `http://127.0.0.1:8000/api${file.file}`;
                              window.open(fileUrl, '_blank');
                            } else {
                              console.error('File path not available');
                            }
                          }}
                        >
                          Download File
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography>No educational files available.</Typography>
            )}
          </Grid>
        </Box>
      </Grid>

      {/* Right Side: Educational Videos */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          Educational Videos
        </Typography>
        <Box sx={{
          height: '100%',
          paddingLeft: 2, // Add some padding on the left of this section
        }}>
          <Grid container spacing={2}>
            {educationalVideos.length > 0 ? (
              educationalVideos.map((video) => (
                <Grid item xs={6} sm={4} md={3} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      {/* Video */}
                      <Box sx={{ 
                        width: '100%', 
                        height: 0, 
                        paddingTop: '100%', // Aspect ratio 1:1 for square
                        position: 'relative' 
                      }}>
                        <iframe
                          src={video.src}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={video.Title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            objectFit: 'cover', // Ensures the video covers the area uniformly
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {video.Title}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small" // Make button smaller
                        onClick={() => {
                          setSelectedVideoUrl(video.src);
                          setOpenVideoModal(true);
                        }}
                        startIcon={<PlayArrow />}
                      >
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No educational videos available.</Typography>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>

    {/* Full-Screen Video Modal */}
    <Dialog open={openVideoModal} onClose={() => setOpenVideoModal(false)} fullWidth maxWidth="lg">
      <DialogTitle>Watch Full-Screen Video</DialogTitle>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
        <iframe
          width="100%"
          height="500"
          src={selectedVideoUrl} // Use the selected video URL
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenVideoModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </Box>
)}




        <TabPanel value={tabValue} index={2}>
          <AttendanceStatus Topic={classDetails.Topic}/>
        </TabPanel>
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>Submit answer for homework: <strong>{selectedHomework?.Title}</strong></DialogTitle>
          <DialogContent>
            {currentDate >= new Date(selectedHomework?.DeadLine).getDate() ? (
              <Box sx={{display:'flex', flexDirection:'row', gap:'5px', marginBottom:'30px'}}>
                <Typography>Upload a new file or change existing file:</Typography>
                <input type="file" onChange={handleFileChange}/>
              </Box>
              ) : <Typography sx={{marginBottom:'30px'}}>Deadline passed!</Typography>}
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Box sx={{display:'flex', flexDirection:'column', width:'50%', gap:'10px'}}>
                <Typography variant="h5">Uploaded file:</Typography>
                <Typography>
                  <a
                    href={getUploadedFileForStudent(studentId, records)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const fileurl = getUploadedFileForStudent(studentId, records);
                      if (fileurl !== 'Not uploaded any file!') {window.open(`http://127.0.0.1:8000/api${fileurl}`, '_blank');}
                      else {console.error('File path not available');}
                    }}
                  >
                    {getUploadedFileForStudent(studentId, records) !== 'Not uploaded any file!' ? removeMediaPrefix(getUploadedFileForStudent(studentId, records)) : 'Not uploaded any file!'}
                  </a>
                </Typography>
              </Box>
              <Box sx={{width:'50%'}}>
                <Typography variant="h5">Your grade: {getGradeForStudent(studentId, records)}</Typography>
              </Box>
            </Box>
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
              onClick={() => setTabValue(4)}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  transition: "background-color 0.3s",
                },
                cursor: "pointer",
                borderRadius: 1,
                padding: theme.spacing(1),
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Chat" />
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
         <ListItemIcon sx={{ color: "#fff" }}>
           <BookIcon />
         </ListItemIcon>
      <ListItemText primary="Educational Content" />
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
