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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
      backgroundColor: '#0036AB',
    },
  },
  listItemHighlight: {
    padding: '20px',
  },
  listItemText: {
    fontWeight: 500,
  },
  previewText: {
    color: '#555',
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
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem("activeClassTab");
    return savedTab !== null ? parseInt(savedTab) : 0; // اگر مقدار ذخیره‌شده وجود دارد، از آن استفاده کن، در غیر این صورت مقدار 0
  });
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
  const currentDate = new Date().getTime();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop ? { variant: 'permanent', open: true } : { open: sidebarOpen, onClose: toggleSidebar };

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  
  const [educationalVideos, setEducationalVideos] = useState([]);
  const [educationalFiles, setEducationalFiles] = useState([]);
  const [descriptiveQuizzes, setDescriptiveQuizzes] = useState([]);
  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue); // تغییر مقدار تب
  //   localStorage.setItem("activeClassTab", newValue); // ذخیره مقدار در localStorage
  // };
  
  useEffect(() => {
    const savedTab = localStorage.getItem("activeClassTab");
    if (savedTab !== null) {
      setTabValue(parseInt(savedTab)); // مقدار ذخیره‌شده را بازیابی و تنظیم کنید
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptiveQuizzes((prevQuizzes) => {
        const now = new Date();
        return prevQuizzes.map((quiz) => {
          const openTime = new Date(quiz.OpenTime);
          const endTime = new Date(openTime);
          endTime.setHours(endTime.getHours() + quiz.DurationHour || 0);
          endTime.setMinutes(endTime.getMinutes() + quiz.DurationMinute || 0);
  
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
    const fetchDescriptiveQuizzes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/quiz/student_quizzes/", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (response.ok) {
          const data = await response.json();
  
          // فیلتر فقط کوییزهای تشریحی، اگر نیاز باشد
          const descriptiveQuizzes = data.filter(quiz => quiz.Is_Published); // فرض: "Is_Published" معیار انتشار است
          setDescriptiveQuizzes(descriptiveQuizzes);
        } else {
          console.error('Failed to fetch quizzes');
        }
      } catch (error) {
        console.error('Error fetching descriptive quizzes:', error);
      }
    };
  
    fetchDescriptiveQuizzes();
  }, []);
  
  


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
                // console.log("Fetched educational videos:", data);  // Log the entire response
    
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
  useEffect(() => {
    const fetchDescriptiveQuizStatuses = async () => {
      const openQuizzes = descriptiveQuizzes.filter((quiz) => quiz.isQuizOpen || quiz.isQuizEnded === false);
  
      if (openQuizzes.length === 0) {
        return;
      }
  
      const statuses = await Promise.all(
        openQuizzes.map(async (quiz) => {
          const isFinished = await checkDescriptiveQuizStatus(quiz.id);
          return { id: quiz.id, finished: isFinished };
        })
      );
  
      setFinishedQuizzes((prev) => {
        const prevMap = new Map(prev.map(obj => [obj.id, obj.finished]));
        statuses.forEach(s => {
          prevMap.set(s.id, s.finished);
        });
        return Array.from(prevMap, ([id, finished]) => ({ id, finished }));
      });
    };
  
    if (descriptiveQuizzes.length > 0) {
      fetchDescriptiveQuizStatuses();
    }
  }, [descriptiveQuizzes]);
  
  const checkDescriptiveQuizStatus = async (quizId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/quiz/student-quiz-finished-boolean/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ QuizTeacherExplan_ID: quizId }), 
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.boolean === true;
      } else {
        console.error("Failed to check descriptive quiz status.");
        return false;
      }
    } catch (error) {
      console.error("Error checking descriptive quiz status:", error);
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
    return rec && rec.Grade !== null ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <span>{rec.Grade}</span>
      <CheckCircleOutlineIcon sx={{ ml: 0.5 }} />
    </Box>) : (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span>Not graded!</span>
        <AccessTimeIcon sx={{ ml: 0.5 }} />
      </Box>
    );
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
      left: { xs: "0px", sm: "240px" },
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
onClick={() => {
  localStorage.removeItem("activeClassTab"); // پاک کردن مقدار از localStorage
  navigate('/student-dashboard'); // هدایت به داشبورد
}}  sx={{
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
                      Submit or view answer / View grade
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

      <TabPanel value={tabValue} index={4}>
                        <AppWrapper onBack={() => {
  localStorage.setItem("activeClassTab", 0); // ذخیره مقدار در localStorage
  setTabValue(0); // تنظیم مقدار جدید
}} /> {/* ارسال تابع بک */}
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
{tabValue === 5 && ( // مقدار جدید تب
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
      Descriptive Quizzes
    </Typography>
    <Box
      sx={{
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: 2,
      }}
    >
   {descriptiveQuizzes.length > 0 ? (
  descriptiveQuizzes.map((quiz) => {
    const isQuizFinished = finishedQuizzes.find((q) => q.id === quiz.id)?.finished || false;

    // محاسبه زمان پایان امتحان
    const openTime = new Date(quiz.OpenTime);
    const quizEnd = new Date(openTime);
    quizEnd.setHours(quizEnd.getHours() + (quiz.DurationHour || 0));
    quizEnd.setMinutes(quizEnd.getMinutes() + (quiz.DurationMinute || 0));

    return (
      <Card
        key={quiz.id}
        variant="outlined"
        sx={{
          marginBottom: 2,
          transition: '0.3s',
          '&:hover': {
            boxShadow: quiz.isQuizOpen && !isQuizFinished ? 3 : 1,
            backgroundColor: quiz.isQuizOpen && !isQuizFinished ? '#f0f0f0' : 'transparent',
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
            Duration: 
            {quiz.DurationHour > 0 ? `${quiz.DurationHour} hour(s)` : ''}
            {quiz.DurationMinute > 0 ? ` ${quiz.DurationMinute} minute(s)` : ''}
          </Typography>

          {/* مدیریت دکمه‌ها بر اساس وضعیت */}
          {quiz.isQuizEnded ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {
                navigate(`/student-dashboard/student-classes/${cid}/descriptive-quiz/${quiz.id}/results`);
              }}
            >
              Show Results
            </Button>
          ) : isQuizFinished ? (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              You have already finished this quiz. Results will be available on: {quizEnd.toLocaleString()}
            </Typography>
          ) : quiz.isQuizOpen ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {
                navigate(`/student-dashboard/student-classes/${cid}/descriptive-quiz/${quiz.id}`, {
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
    No descriptive quizzes available.
  </Typography>
)}



    </Box>
  </Box>
)}





        <TabPanel value={tabValue} index={2}>
          <AttendanceStatus Topic={classDetails.Topic}/>
        </TabPanel>
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h6">
              Submit Answer for Homework: <strong>{selectedHomework?.Title}</strong>
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              {currentDate <= new Date(selectedHomework?.DeadLine).getTime() && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1">
                    Please upload or update your assignment file below:
                  </Typography>
                  <Box>
                    <input type="file" onChange={handleFileChange} />
                  </Box>
                </Box>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Your Submitted File:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(() => {
                    const fileUrl = getUploadedFileForStudent(studentId, records);
                    if (fileUrl !== 'Not uploaded any file!') {
                      return (
                        <a
                          href={`http://127.0.0.1:8000/api${fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          {removeMediaPrefix(fileUrl)}
                        </a>
                      );
                    } else {
                      return <span style={{ color: '#666' }}>No file submitted yet.</span>;
                    }
                  })()}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Grade Received:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {getGradeForStudent(studentId, records)}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
            <Button onClick={handleDialogClose} variant="outlined" color="error">
              Cancel
            </Button>
            {currentDate <= new Date(selectedHomework?.DeadLine).getTime() ? (
              <Button
                onClick={handleFileSubmit}
                color="primary"
                variant="contained"
                startIcon={<Send />}
              >
                Submit
              </Button>
            ) : (
              <Typography
                variant="body1"
                color={getUploadedFileForStudent(studentId, records) !== 'Not uploaded any file!' ? 'green' : 'red'}
              >
                {getUploadedFileForStudent(studentId, records) !== 'Not uploaded any file!'
                  ? 'Your answer is submitted and deadline is passed!'
                  : 'You did not send anything and deadline is passed!'}
              </Typography>
            )}
          </DialogActions>
        </Dialog>

      </Container>
      </Box>
      <Drawer anchor='left' {...drawerProps} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.drawer, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
    <Toolbar />
  <List>
    <ListItem button onClick={() => {
  localStorage.setItem("activeClassTab", 0); // ذخیره مقدار در localStorage
  setTabValue(0); // تنظیم مقدار جدید
}}
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
    <ListItem button onClick={() => {
  localStorage.setItem("activeClassTab", 1); // ذخیره مقدار در localStorage
  setTabValue(1); // تنظیم مقدار جدید
}}
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
    <ListItem button onClick={() => {
  localStorage.setItem("activeClassTab", 2); // ذخیره مقدار در localStorage
  setTabValue(2); // تنظیم مقدار جدید
}}
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
              onClick={() => {
                localStorage.setItem("activeClassTab", 4); // ذخیره مقدار در localStorage
                setTabValue(4); // تنظیم مقدار جدید
              }}
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
            
    <ListItem button onClick={() => {
  localStorage.setItem("activeClassTab", 3); // ذخیره مقدار در localStorage
  setTabValue(3); // تنظیم مقدار جدید
}}
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
<ListItem button onClick={() => {
  localStorage.setItem("activeClassTab", 5); // ذخیره مقدار در localStorage
  setTabValue(5); // تنظیم مقدار جدید
}} // مقدار جدید برای این تب
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
    <Assessment /> {/* آیکون مناسب */}
  </ListItemIcon>
  <ListItemText primary="Descriptive Quizzes" />
</ListItem>
<ListItem
  button
  onClick={() => {
    localStorage.removeItem("activeClassTab"); // پاک کردن مقدار از localStorage
    navigate('/student-dashboard'); // هدایت به داشبورد
  }}
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
