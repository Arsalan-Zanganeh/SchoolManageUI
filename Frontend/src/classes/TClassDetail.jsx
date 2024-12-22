import React, { useEffect, useState, useCallback } from "react";
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
  CircularProgress,
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
import ChatIcon from '@mui/icons-material/Chat';
import BookIcon from '@mui/icons-material/Book';
import Attendance from "../Attendence";
import AppWrapper from './chatpage';

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // برای شناسایی حالت موبایل

  const [classes, setClasses] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    Title: "",
    Description: "",
    DeadLine: "",
  });
  const [assignments, setAssignments] = useState([]);
  const [publishedHomeworks, setPublishedHomeworks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false); // برای کنترل نمایش دیالوگ
  const [quizTitle, setQuizTitle] = useState(""); // برای ذخیره عنوان کوئیز
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const drawerProps = isDesktop
    ? { variant: "permanent", open: true }
    : { open: sidebarOpen, onClose: toggleSidebar };

  const [chatOpen, setChatOpen] = useState(false); // State to control chat dialog visibility
  const [messages, setMessages] = useState([]);

  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [fileTitle, setFileTitle] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [openFullScreen, setOpenFullScreen] = useState(false);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState('');  
  const [contentTabValue, setContentTabValue] = useState(0); // 0: Files, 1: Video

  const handleChange = (event, newValue) => {
    settabvalue(newValue);
    localStorage.setItem('activeTeacherTab', newValue);
  };

  const handleCloseChat = () => {
    setChatOpen(false); // Close the chat dialog
  };
  
    
  const handleContentTabChange = (event, newValue) => {
    setContentTabValue(newValue);
  };

  const handleOpenVideoFullScreen = (videoSrc) => {
    setSelectedVideoSrc(videoSrc);
    setOpenFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setOpenFullScreen(false);
  };
  


  const handleQuizDialogOpen = () => setQuizDialogOpen(true);
  
  const handleQuizDialogClose = () => {
    setQuizDialogOpen(false);
    setQuizTitle("");
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
        DurationMinute: parseInt(durationMinute, 10),
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

    
  useEffect(() => {
    const fetchFiles = async () => {
      if (!teacherToken || !classToken) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/discipline/teacher-watchfile-EC/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          console.error('Failed to fetch files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [teacherToken, classToken]);

  // Fetch Class Videos
  useEffect(() => {
    const fetchVideos = async () => {
      if (!teacherToken || !classToken) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/discipline/teacher-watchvid-EC/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error('Failed to fetch videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, [teacherToken, classToken]);

  // Handle File Upload
  const handleFileUpload = async () => {
    if (!selectedFile || !fileTitle) {
      setMessage('Please select a file and provide a title.');
      return;
    }
    setLoading(true);
    setMessage('');
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('Title', fileTitle);  // Add the title
  
    try {
      const response = await fetch('http://127.0.0.1:8000/discipline/teacher-addfile-EC/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setFiles((prevFiles) => [...prevFiles, data]);
        setMessage('File uploaded successfully.');
        setOpenFileDialog(false);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to upload file: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Video Upload
  const handleVideoUpload = async () => {
    if (!selectedVideo || !videoTitle) {
      setMessage('Please select a video and provide a title.');
      return;
    }
    setLoading(true);
    setMessage('');
  
    const formData = new FormData();
    formData.append('src', selectedVideo);
    formData.append('Title', videoTitle);  // Add the title
  
    try {
      const response = await fetch('http://127.0.0.1:8000/discipline/teacher-addvid-EC/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${teacherToken}`,
        },
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setVideos((prevVideos) => [...prevVideos, data]);
        setMessage('Video uploaded successfully.');
        setOpenVideoDialog(false);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to upload video: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while uploading the video.');
    } finally {
      setLoading(false);
    }
  };
  


  // Handle Delete File
  const handleDeleteFile = async (fileId) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/discipline/teacher-delfile-EC/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: fileId }),
      });

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
        setMessage('File deleted successfully.');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete file: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the file.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Video
  const handleDeleteVideo = async (videoId) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/discipline/teacher-delvid-EC/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: videoId }),
      });

      if (response.ok) {
        setVideos((prevVideos) => prevVideos.filter(video => video.id !== videoId));
        setMessage('Video deleted successfully.');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete video: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the video.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      if (!teacherToken) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/teacher/classes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        } else {
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
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
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/teacher-all-homeworks/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();

          const unpublishedAssignments = data
            .filter((hw) => !hw.Is_Published)
            .map((hw) => ({
              ...hw,
              id: hw.id,
            }));
          const publishedAssignments = data
            .filter((hw) => hw.Is_Published)
            .map((hw) => ({
              ...hw,
              id: hw.id,
            }));

          setAssignments(unpublishedAssignments);
          setPublishedHomeworks(publishedAssignments);
        } else {
          console.error("Failed to fetch homeworks");
        }
      } catch (error) {
        console.error("Error fetching homeworks:", error);
      }
    };

    fetchHomeworks();
  }, [teacherToken]);

  const [teacherName, setTeacherName] = useState("Loading...");

  const [name, setName] = useState("Loading...");
  const [lastName, setLastName] = useState("");

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/teacher/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // برای ارسال کوکی‌ها و احراز هویت
      });

      if (response.ok) {
        const teacherData = await response.json();
        setName(teacherData.first_name);
        setLastName(teacherData.last_name);
      } else {
        console.error("Failed to fetch teacher data");
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  }, []);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/teacher_quizzes/",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // محاسبه endTime برای هر کوئیز در لحظه دریافت
          const updatedQuizzes = data.map((quiz) => {
            const openTime = new Date(quiz.OpenTime);
            const endTime = new Date(openTime);
            endTime.setHours(endTime.getHours() + (quiz.DurationHour || 0));
            endTime.setMinutes(
              endTime.getMinutes() + (quiz.DurationMinute || 0)
            );
            return {
              ...quiz,
              endTime: endTime.toISOString(),
            };
          });
          setQuizzes(updatedQuizzes);
        } else {
          console.error("Failed to fetch quizzes");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
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
    setMessage("");

    if (!teacherToken) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/teacher-add-homework/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newAssignment),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) => [...prev, data]);
        setOpenDialog(false);
        setNewAssignment({ Title: "", Description: "", DeadLine: "" });
        setMessage("Homework added successfully");
      } else {
        setMessage("Failed to add homework");
      }
    } catch (error) {
      setMessage("An error occurred while adding homework");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishHomework = async (homeworkId) => {
    setLoading(true);

    const homeworkToPublish = assignments.find(
      (assignment) => assignment.id === homeworkId
    );

    if (!teacherToken) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/teacher-publish-homework/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ Homework_ID: homeworkId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) =>
          prev.filter((assignment) => assignment.id !== homeworkId)
        );
        setPublishedHomeworks((prev) => [
          ...prev,
          { ...homeworkToPublish, Is_Published: true },
        ]);
        setMessage(
          `Homework "${homeworkToPublish.Title}" published successfully`
        );
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to publish homework: ${errorData.error}`);
        console.error("Failed to publish homework", errorData);
      }
    } catch (error) {
      setMessage("An error occurred while publishing homework");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!classDetails) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading class details...
        </Typography>
      </Container>
    );
  }
  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) {
      setMessage("Quiz title cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/create_quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ Title: quizTitle }),
      });

      if (response.ok) {
        const newQuiz = await response.json();
        console.log("Response from server:", newQuiz);
        if (!newQuiz.OpenTime) {
          newQuiz.OpenTime = new Date().toISOString();
        }
        setQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
        setQuizTitle("");
        handleQuizDialogClose();
        setMessage("Quiz created successfully");
      } else {
        const errorData = await response.json();
        setMessage(`Failed to create quiz: ${errorData.error}`);
        console.error("Failed to create quiz", errorData);
      }
    } catch (error) {
      setMessage("An error occurred while creating quiz");
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (HomeworkID) => {
    setLoading(true);
    setMessage("");

    const homeworkToDelete = assignments.find(
      (assignment) => assignment.id === HomeworkID
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/teacher-delete-homework/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${teacherToken}`,
          },
          credentials: "include",
          body: JSON.stringify({
            Homework_ID: HomeworkID,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAssignments((prev) =>
          prev.filter((assignment) => assignment.id !== HomeworkID)
        );
        setPublishedHomeworks((prev) => 
          prev.filter((homework) => homework.id !== HomeworkID)
        )
        set
        setMessage(
          `Homework "${homeworkToDelete.Title}" deleted successfully!`
        );
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete homework: ${errorData.error}`);
        console.error("Failed to delete homework", errorData);
      }
    } catch (error) {
      setMessage("An error occurred while deleting homework");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>

    <Box
      sx={{
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
     <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.primary.main,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative" }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                position: "absolute",
                left: 0, 
                padding: "4px",
                width: "36px",
                height: "36px",
              }}
            >
              <Menu />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontSize: isMobile ? "1rem" : "1.25rem", 
              textAlign: "center",
              width: "100%", 
            }}
          >
            {`${classDetails.Topic}`}
          </Typography>
        </Grid>
      </Toolbar>
    </AppBar>
<Toolbar />
<Box sx={{ display: "flex", flexGrow: 1 }}>
  <Box component="main" sx={{ flexGrow: 1, mt: 4 }}>
    <Container maxWidth="">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "#DCE8FD",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h5" color="primary" gutterBottom>
              {classDetails.Topic}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Instructor: {name} {lastName}
            </Typography>
          </Box>
          <IconButton
            color="default"
            onClick={() => navigate(-1)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              width: "36px",
              height: "36px",
              marginLeft: "auto",
            }}
          >
            <BackIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2, textAlign: 'center' }}>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: "#F5F5F5",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                transition: "transform 0.3s ease-in-out",
                '&:hover': {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Session 1: {classDetails.Session1Day} - {classDetails.Session1Time}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: "#F5F5F5",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                transition: "transform 0.3s ease-in-out",
                '&:hover': {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Session 2: {classDetails.Session2Day} - {classDetails.Session2Time}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
   
  

        {tabValue === 0 && (
  <Box
    sx={(theme) => ({
      maxHeight: "400px",
      overflowY: "auto",
      padding: 1,
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",

      // استایل مخصوص موبایل
      [theme.breakpoints.down("sm")]: {
        maxHeight: "none", // حذف محدودیت ارتفاع در موبایل
        border: "none", // ساده‌تر کردن ظاهر در موبایل
        borderRadius: 0, // حذف گوشه‌های گرد در موبایل
        padding: theme.spacing(1), // تعیین پدینگ متناسب با موبایل
        overflowY: "visible", // آزاد کردن اسکرول در موبایل
      },
    })}
  >
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      fullWidth
      onClick={handleQuizDialogOpen}
      sx={{ mb: 2 }}
    >
      Add Quizzes
    </Button>

    <Stack spacing={2}>
      {quizzes.map((quiz) => {
        const openTime = new Date(quiz.OpenTime);
        const endTime = new Date(openTime);
        endTime.setHours(openTime.getHours() + quiz.DurationHour);
        endTime.setMinutes(openTime.getMinutes() + quiz.DurationMinute);

        const now = new Date();
        const isQuizEnded = now > endTime;

        return (
          <Card key={quiz.id} variant="outlined" sx={{ marginBottom: 2, padding: 1 }}>
  <CardContent>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        textAlign: "center",
        padding: 2,
        [theme.breakpoints.up("sm")]: {
          flexDirection: "row",
          textAlign: "left",
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 2,
          [theme.breakpoints.up("sm")]: {
            alignItems: "flex-start",
            marginBottom: 0,
          },
        }}
      >
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          {quiz.Title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Open Time: {openTime.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ends at: {endTime.toLocaleString()}
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        sx={{
          gap: 1,
          [theme.breakpoints.up("sm")]: {
            justifyContent: "flex-end",
          },
        }}
      >
        <IconButton
          color="primary"
          onClick={() =>
            navigate(`/teacher-dashboard/teacher-classes/${tcid}/quiz/${quiz.id}`)
          }
          sx={{
            padding: 1,
          }}
        >
          <EditIcon />
        </IconButton>
        {isQuizEnded ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(
                `/teacher-dashboard/teacher-classes/${tcid}/quiz/${quiz.id}/results`
              )
            }
            sx={{
              fontSize: "0.9rem",
              padding: "6px 12px",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            }}
          >
            View Results
          </Button>
        ) : quiz.Is_Published ? (
          <Button
            variant="contained"
            color="secondary"
            disabled
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#666",
              padding: "6px 12px",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            }}
          >
            Published
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal(quiz)}
            sx={{
              padding: "6px 12px",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            }}
          >
            Publish
          </Button>
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
          InputLabelProps={{ shrink: true, }}
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

      <TabPanel value={tabValue} index={7}>
                  <AppWrapper onBack={() => handleTabChange(0)} /> {/* ارسال تابع بک */}
      </TabPanel>

              
{tabValue === 1 && (
  <Box>
    <Stack spacing={2}>
      {/* دکمه "Create New Assignment" در بالا */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        fullWidth
        sx={{
          padding: "10px 15px",
          fontSize: "1rem",
        }}
      >
        Create New Assignment
      </Button>

      {assignments.map((assignment) => (
        <Card key={assignment.Homework_ID} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={(theme) => ({
                textAlign: "center",
                [theme.breakpoints.up("sm")]: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  textAlign: "left",
                },
              })}
            >
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    marginBottom: "5px",
                    fontSize: "1rem",
                  }}
                >
                  {assignment.Title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "0.9rem" }}
                >
                  Due on {assignment.DeadLine}
                </Typography>
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap" // دکمه‌ها در موبایل به خط بعدی بروند
                gap="10px"
                sx={(theme) => ({
                  marginTop: theme.spacing(2),
                  justifyContent: "center",
                  [theme.breakpoints.up("sm")]: {
                    marginTop: 0,
                    justifyContent: "flex-end",
                  },
                })}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<PublishIcon />}
                  onClick={() => handlePublishHomework(assignment.id)}
                  sx={{
                    padding: "6px 12px",
                    fontSize: "0.8rem",
                    [theme.breakpoints.down("sm")]: {
                      width: "100%", // دکمه تمام عرض را بگیرد در موبایل
                    },
                  }}
                >
                  Publish
                </Button>
                <IconButton
                  color="primary"
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  sx={{
                    padding: "6px",
                    [theme.breakpoints.down("sm")]: {
                      width: "100%", // آیکون تمام عرض را بگیرد در موبایل
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
)}



              {tabValue === 2 && (
                <Box
                  sx={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    padding: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Stack spacing={2}>
                    {publishedHomeworks.map((homework) => (
                      <Card key={homework.Homework_ID} variant="outlined">
                        <CardContent>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="body1">
                                {homework.Title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Due on {homework.DeadLine}
                              </Typography>
                            </Box>
                            <Box sx={{display:'flex', flexDirection:'row', gap:'15px'}}>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                size="small"
                                onClick={() => navigate(`/teacher-dashboard/teacher-classes/${tcid}/submitted-assignments/${homework.id}`)}
                              >
                                View submitted assignments
                              </Button>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleDeleteAssignment(homework.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
                
              )}

{tabValue === 4 && ( 
  <Box>
    <Typography variant="h4" sx={{ mt: 4 }}>
      Class Educational Content
    </Typography>

    {/* Educational Files and Educational Videos Tabs */}
    <Tabs
      value={contentTabValue}
      onChange={handleContentTabChange}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
    >
      <Tab label="Educational Files" />
      <Tab label="Educational Videos" />
    </Tabs>

    {/* Educational Files Section */}
    {contentTabValue === 0 && (
      <Box>
        <Typography variant="h6">Educational Files</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenFileDialog(true)}
          startIcon={<AddIcon />}
        >
          Add File
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="body1">{file.Title}</Typography> {/* Show Title */}
                <Typography variant="body2">{file.name}</Typography> {/* Show File Name */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteFile(file.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    )}

    {/* Add File Dialog */}
    <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
      <DialogTitle>Upload Educational File</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="File Title"
          variant="outlined"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="application/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
        <Button onClick={handleFileUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Educational Videos Section */}
    {/* Educational Videos Section */}
{contentTabValue === 1 && (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Educational Videos
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={() => setOpenVideoDialog(true)}
      startIcon={<AddIcon />}
    >
      Add Video (Embed YouTube Link)
    </Button>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {videos.map((video) => (
        <Grid item xs={12} sm={6} md={4} key={video.id}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="body1">{video.Title}</Typography> {/* Show Title */}
            {/* Button to Watch Full Screen */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenVideoFullScreen(video.src)}
              sx={{ mt: 1 }}
            >
              Watch Full Screen
            </Button>
            {/* Delete Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteVideo(video.id)}
              startIcon={<DeleteIcon />}
              sx={{ mt: 1 }}
            >
              Delete
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
)}

{/* Add Video Dialog */}
<Dialog open={openVideoDialog} onClose={() => setOpenVideoDialog(false)}>
  <DialogTitle>Upload Educational Video (Embed Link)</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Video Title"
      variant="outlined"
      value={videoTitle}
      onChange={(e) => setVideoTitle(e.target.value)}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      label="Enter YouTube Video URL"
      variant="outlined"
      value={selectedVideo}
      onChange={(e) => setSelectedVideo(e.target.value)}
      sx={{ mb: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenVideoDialog(false)}>Cancel</Button>
    <Button onClick={handleVideoUpload} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : 'Upload'}
    </Button>
  </DialogActions>
</Dialog>

{/* Full Screen Video Modal */}
<Dialog open={openFullScreen} onClose={handleCloseFullScreen} fullWidth maxWidth="lg">
  <DialogTitle>Watch Full-Screen Video</DialogTitle>
  <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
    <iframe
      width="100%"
      height="500"
      src={selectedVideoSrc}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseFullScreen}>Close</Button>
  </DialogActions>
</Dialog>

  </Box>
)}

{/* Feedback Message */}
{message && <Typography color="error">{message}</Typography>}

{/* Chat Modal */}
<Dialog open={chatOpen} onClose={handleCloseChat} fullWidth maxWidth="sm">
  <DialogTitle>Class Chat</DialogTitle>
  <DialogContent>
    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Stack spacing={2}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {message.sender} ({message.email}):
            </Typography>
            <Typography variant="body1">{message.content}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Send Message */}
    <TextField
      label="Type a message"
      variant="outlined"
      fullWidth
      margin="dense"
      multiline
      rows={3}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.value) {
          handleSendMessage(e.target.value);
          e.target.value = ''; // Clear the message input after sending
        }
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseChat} color="secondary">
      Close
    </Button>
  </DialogActions>
</Dialog>

              <TabPanel value={tabValue} index={3}>
                <Attendance />
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
                  type="datetime-local"
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
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
        <Drawer
          anchor="left"
          {...drawerProps}
          sx={{
            "& .MuiDrawer-paper": {
              bgcolor: theme.palette.primary.drawer,
              color: theme.palette.text.primary,
              "& .MuiListItemText-primary": { color: "#fff" },
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItem
              button
              onClick={() => setTabValue(0)}
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
                <Quiz />
              </ListItemIcon>
              <ListItemText primary="Quizzes" />
            </ListItem>
            <ListItem
              button
              onClick={() => setTabValue(1)}
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
                <EditNote />
              </ListItemIcon>
              <ListItemText primary="Assignments" />
            </ListItem>
            <ListItem
              button
              onClick={() => setTabValue(2)}
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
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Published Homeworks" />
            </ListItem>
            <ListItem
              button
              onClick={() => setTabValue(3)}
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
                <People />
              </ListItemIcon>
              <ListItemText primary="Attendance" />
            </ListItem>
            <ListItem
              button
              onClick={() => setTabValue(7)}
              sx={{
                "&:hover": {
                  backgroundColor: "gray", // Test with a solid color
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
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="Educational Content" />
            </ListItem>
            <ListItem
              button
              onClick={() => navigate(-1)}
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
};

export default TeacherClassDetail;