import React, { useState, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  ListItemIcon,
  DialogContent,
  DialogTitle,
  CssBaseline,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  ExitToApp,
  Menu,
  Class,
  Person,
  PersonAdd,
  School,
  Person4,
  HomeWork,
  NotificationAdd,
  PermContactCalendar,
  Security,
  QueryBuilder,
  ExpandMore,
  ExpandLess,
  HideImageTwoTone,
} from "@mui/icons-material";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SchoolIcon from "@mui/icons-material/School";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BusinessIcon from "@mui/icons-material/Business";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import AppWrapper from "./ProfileStudent";
import { useMediaQuery } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useStudent } from "../context/StudentContext";
import StudentClassList from "./show-classes/student";
import HollandTest from "../HollandTest/HollandTest";
import HollandQuestions from "../HollandTest/HollandQuestions";
import HollandResults from "../HollandTest/HollandAnalysis";
import PreviousResults from "../HollandTest/PreviousResults";
import Planner from "./Planning/planner";
import "./SchoolDashboard.css";

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const styles = {
  list: {
    width: "95%", // مقدار دوم برای کلید `list` انتخاب شد
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "8px",
  },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "16px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f1f1f1", // مقدار دوم برای کلید `listItem` انتخاب شد
    },
  },
  listItemHighlight: {
    padding: "20px",
  },
  listItemText: {
    fontWeight: 500,
  },
  previewText: {
    color: "#555",
  },
  previewTextGray: {
    color: "#C8C6C6", // Gray for seen notifications
  },
  previewTextBlack: {
    color: "#000", // Black for unseen notifications
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  dialogContent: {
    padding: "16px",
  },
  dateText: {
    fontWeight: "bold", // Bold date
    marginRight: "16px",
    color: "#aaa",
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#0036AB",
      drawer: "#0051FF",
    },
    text: {
      secondary: "#757575",
    },
    background: {
      default: "#f4f6f8",
    },
  },
});

const NavigationBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: "#ffffff",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    cursor: "pointer",
  },
  width: "200px",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const StudentDashboard = () => {
  const [tabvalue, settabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { student, logoutStudent } = useStudent();
  const [name, setName] = useState(student ? student.first_name : "");
  const [nofunseen, setcount] = useState(0);
  const [lastName, setLastName] = useState(student ? student.last_name : "");
  const [profileImage, setProfileImage] = useState(null);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const token = student?.jwt;
  const [homeworks, setHomeworks] = useState([]);
  const [quizTests, setQuizTests] = useState([]);
  const [quizExplans, setQuizExplans] = useState([]);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [showDescriptiveQuizzes, setShowDescriptiveQuizzes] = useState(false);
  const [showTestQuizzes, setShowTestQuizzes] = useState(false);
  const [showHomeworks, setShowHomeworks] = useState(false);
  const toggleDescriptiveQuizzes = () => setShowDescriptiveQuizzes(!showDescriptiveQuizzes);
  const toggleTestQuizzes = () => setShowTestQuizzes(!showTestQuizzes);
  const toggleHomeworks = () => setShowHomeworks(!showHomeworks);
  const drawerProps = isDesktop
    ? { variant: "permanent", open: true }
    : { open: sidebarOpen, onClose: toggleSidebar };

  useEffect(() => {
    // Load tab value from localStorage
    const savedTab = localStorage.getItem("student-dashboard-tab");
    if (savedTab !== null) {
      settabvalue(Number(savedTab));
    }
  }, []);
  const handleTabChange = (newTabValue) => {
    settabvalue(newTabValue);
    localStorage.setItem('activeTab', newTabValue); // Save active tab to localStorage
  };
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.seen) {
      handleSeenMessage(notification);
      notification.seen = true;
      setcount(nofunseen - 1);
    }
  };

  const handleBackClick = () => {
    setSelectedNotification(null);
  };

  const handleClickOpen = () => {
    fetchUnreadNotifications();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const createPreview = (message) => {
    const plainText = message.replace(/<[^>]+>/g, ""); // Strip HTML tags
    const preview = plainText.split(" ").slice(0, 10).join(" ") + "..."; // Take first 10 words
    return preview;
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student/profile/`, {
          credentials: "include", // ensures cookies/session are sent
        });
  
        if (response.ok) {
          const data = await response.json();
          // Ensure the response contains the profile image
          const profileImageUrl = data?.StudentProfile?.[0]?.profile_image;
          
          if (profileImageUrl) {
            setProfileImage(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${profileImageUrl}`);
          } else {
            setProfileImage(null); // If there's no image, reset the profileImage state
          }
        } else {
          console.error("Failed to fetch profile image.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
  
    fetchProfileImage();
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("student-dashboard-tab"); // حذف وضعیت تب‌ها از localStorage
    logoutStudent();
    navigate("/");
  };

  const fetchCalendar = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-google-calendar/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
      const errorData = await submit.json();

      if (errorData) {
        let errorMessage = '';
        for (const key in errorData) {
          if (errorData.hasOwnProperty(key)) {
            errorMessage += `${key}: ${errorData[key].join(', ')}\n`;
          }
        }
        Swal.fire({
          title: 'Error',
          text: errorMessage || 'Failed to Add Event. Please check the details and try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire('Error', 'An unknown error occurred. Please try again later.', 'error');
      }
    } 
  } catch (error) 
  {
    Swal.fire('Error', 'Ask your Principal to Connect his Google Account First!', 'error');
    console.error('Error:', error);
  }
}, [token]);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const fetchnotifresponse = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/notifications/`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (fetchnotifresponse.ok) {
        const notifdata = await fetchnotifresponse.json();
        setUnreadNotifications(notifdata);
      } else {
        console.error("Failed to fetch notif list");
      }
    } catch (error) {
      console.error("Error fetching notif list:", error);
    }
  }, [token]);

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/user/`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const studentData = await response.json();
        setName(studentData.first_name);
        setLastName(studentData.last_name);
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }, [token]);

  const fetchnumberofunread = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/unseen_notifications/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const studentData = await response.json();
        setcount(studentData.count);
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }, [token]);

  const handleSeenMessage = async (notification) => {
    if (!notification || !notification.id) {
      console.error(
        "Selected notification is not defined or does not have an id."
      );
      Swal.fire("Error", "No notification selected.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-single-notif-seen/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: notification.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      //Swal.fire("Success", "Notification marked as seen.", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        "Server error or network issue. Please try again.",
        "error"
      );
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchnumberofunread();
      fetchStudentData();
    }
  }, [token, fetchStudentData]);

  const editProfile = () => handleTabChange(6);
  const viewClasses = () => handleTabChange(4);
  const gotoHollandtest = () => handleTabChange(5);
  const gotoAcademicPlanning = () => handleTabChange(9);

  const sortedNotifications = [...unreadNotifications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const fetchRecentHomework = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/recent-homework/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setHomeworks(data);
      } else {
        console.error('Failed to fetch recent homework');
      }
    } catch (error) {
      console.error('Error fetching recent homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizTests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/recent-quiz-test/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setQuizTests(data);
      } else {
        console.error('Failed to fetch recent quiz tests');
      }
    } catch (error) {
      console.error('Error fetching recent quiz tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizExplans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/recent-quiz-explan/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setQuizExplans(data);
      } else {
        console.error('Failed to fetch recent quiz tests');
      }
    } catch (error) {
      console.error('Error fetching recent quiz tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentHomework();
    fetchQuizTests();
    fetchQuizExplans();
  }, []);

  const getRemainingTimeQ = (startTime, durationHours, durationMinutes) => {
    const now = new Date();
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + durationHours * 60 * 60 * 1000 + durationMinutes * 60 * 1000);
    const timeDiff = start - now;
  
    if (timeDiff > 0) {
      // Before the quiz starts
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
  
      if (months > 0) {
        return `${months} months and ${days % 30} days to start`;
      } else if (days > 0) {
        return `${days} days and ${hours % 24} hours to start`;
      } else if (hours > 0) {
        return `${hours} hours and ${minutes % 60} minutes to start`;
      } else if (minutes > 0) {
        return `${minutes} minutes and ${seconds % 60} seconds to start`;
      } else {
        return `${seconds} seconds to start`;
      }
    } else {
      // After the quiz has started
      const remainingTime = endTime - now;
      if (remainingTime <= 0) {
        return "Quiz has ended.";
      }
      const remainingSeconds = Math.floor(remainingTime / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingDays = Math.floor(remainingHours / 24);
      const remainingMonths = Math.floor(remainingDays / 30);
  
      if (remainingHours > 0) {
        return `${remainingHours} hours and ${remainingMinutes % 60} minutes left`;
      } else if (remainingMinutes > 0) {
        return `${remainingMinutes} minutes and ${remainingSeconds % 60} seconds left`;
      } else {
        return `${remainingSeconds} seconds left`;
      }
    }
  };  

  const isStarted = (deadline) => {
    return new Date() > new Date(deadline);
  };

  const getRemainingTimeHW = (deadline) => {
    const now = new Date();
    const endTime = new Date(deadline);
    const timeDiff = endTime - now;
  
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
  
    if (months > 0) {
      return `${months} months and ${days % 30} days left`;
    } else if (days > 0) {
      return `${days} days and ${hours % 24} hours left`;
    } else if (hours > 0) {
      return `${hours} hours and ${minutes % 60} minutes left`;
    } else if (minutes > 0) {
      return `${minutes} minutes left`;
    } else {
      return `${seconds} seconds left`;
    }
  }

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  }
  
  const getMonth = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[date.getMonth()];
  }
  const handleClassLoginWithoutNavigate = async (id) => {
    try {
      const url = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student-login-class/`;
      console.log("Login request URL:", url);
  
      const loginResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include", 
      });
  
      if (loginResponse.ok) {
        const token = await loginResponse.json();
        console.log("Login successful:", token); // لاگ موفقیت
        return token;
      } else {
        const errorDetails = await loginResponse.text();
        console.error("Server returned an error:", loginResponse.status, errorDetails);
        Swal.fire({
          title: "Error",
          text: `Failed to login to the class. Server returned: ${errorDetails}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        throw new Error(`Server error: ${errorDetails}`);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error; 
    }
  };
  
  
  
  const handleDescriptiveQuizClick = async (cid, quiz) => {
    try {
      await handleClassLoginWithoutNavigate(cid);
      
      const openTime = new Date(quiz.OpenTime);
      const quizEnd = new Date(openTime);
      quizEnd.setHours(quizEnd.getHours() + (quiz.DurationHour || 0));
      quizEnd.setMinutes(quizEnd.getMinutes() + (quiz.DurationMinute || 0));
  
      navigate(`/student-dashboard/student-classes/${cid}/descriptive-quiz/${quiz.id}`, {
        state: { quizEndTime: quizEnd.toISOString(), cid },
      });
    } catch (error) {
      console.error("Error logging into class:", error);
    }
  };
  
  const handleTestQuizClick = async (cid, quiz) => {
    try {
      await handleClassLoginWithoutNavigate(cid);
  
      const openTime = new Date(quiz.OpenTime);
      const quizEnd = new Date(openTime);
      quizEnd.setHours(quizEnd.getHours() + quiz.DurationHour);
      quizEnd.setMinutes(quizEnd.getMinutes() + quiz.DurationMinute);
  
      navigate(`/student-dashboard/student-classes/${cid}/quiz/${quiz.id}`, {
        state: { quizEndTime: quizEnd.toISOString(), cid },
      });
    } catch (error) {
      console.error("Error logging into class:", error);
    }
  };

  const handleHomeworkClick = async (cid, homeworkId) => {
    try {
      await handleClassLoginWithoutNavigate(cid);
  
      const homework = homeworks.find((hw) => hw.id === homeworkId);
      if (homework) {
        navigate(`/student-dashboard/student-classes/${cid}`, {
          state: { openHomework: homework },
        });
      }
    } catch (error) {
      console.error("Error logging into class:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
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
            <Grid container alignItems="center" justifyContent="space-between">
              {/* دکمه همبرگری در حالت موبایل */}
              {!isDesktop && (
                <Grid
                  item
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleSidebar}
                    sx={{
                      padding: "8px", // کاهش اندازه دکمه
                      "& svg": { fontSize: "1.5rem" }, // تنظیم سایز آیکون
                    }}
                  >
                    <Menu />
                  </IconButton>
                </Grid>
              )}

              {/* آواتار و نام */}
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
          <Avatar
              alt="Profile Picture"
              src={profileImage || "/default-avatar.png"} // fallback to default avatar
              sx={{
                marginRight: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 3,
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
              onError={(e) => e.target.src = '/default-avatar.png'}
              onClick={() => handleTabChange(6)} // Go to profile on click
            />
                <Typography
                  variant="h6"
                  sx={{
                    flexGrow: 1,
                    fontSize: isDesktop ? "1.2rem" : "1rem", // فونت بزرگ‌تر در دسکتاپ
                    textAlign: "center", // متن وسط‌چین
                  }}
                >
                  {`${name} ${lastName}`}
                </Typography>
              </Grid>

              {/* نوتیفیکیشن */}
              <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="notifications"
                  onClick={handleClickOpen}
                >
                  <Badge badgeContent={nofunseen} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Box sx={{   position: { xs: "relative", sm: "absolute" },
        left: { xs: "0px", sm: "270px" },
        right: { xs: "10px", sm: "30px" },
        // width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
        // maxWidth: { xs: "100%", sm: "1400px" },
        height: { xs: "auto", sm: "auto" },
        margin: "0 auto",
        paddingTop: "30px",
        // backgroundColor: "#fff",
        // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", }}>
          <Box component="main" sx={{ flexGrow: 1, mt: 4 }}>
            <Container maxWidth="lg">
              <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle style={styles.dialogTitle}>
                  Notifications
                </DialogTitle>
                <DialogContent style={styles.dialogContent}>
                  {selectedNotification ? (
                    <Box style={styles.messageContainer}>
                      <Button onClick={handleBackClick} color="primary">
                        Back
                      </Button>
                      <div
                        style={styles.messageContent}
                        dangerouslySetInnerHTML={{
                          __html: selectedNotification.message,
                        }}
                      />
                      <Typography variant="body2" style={styles.dateText}>
                        {formatDate(selectedNotification.date)}
                      </Typography>
                    </Box>
                  ) : sortedNotifications.length > 0 ? (
                    <List style={styles.list}>
                      {sortedNotifications.map((notification) => (
                        <ListItem
                          key={notification.id}
                          button
                          onClick={() => handleNotificationClick(notification)}
                          style={{
                            ...styles.listItem,
                            ...(notification.seen && styles.listItemHighlight), // Change highlight based on seen property
                          }}
                        >
                          <ListItemText
                            primary={
                              <div>
                                <Typography style={styles.dateText}>
                                  {formatDate(notification.date)}
                                </Typography>
                                <Typography
                                  style={{
                                    ...styles.listItemText,
                                    ...(notification.seen
                                      ? styles.previewTextGray
                                      : styles.previewTextBlack), // Change text color based on seen property
                                  }}
                                >
                                  {createPreview(notification.message)}
                                </Typography>
                              </div>
                            }
                            style={
                              notification.seen
                                ? styles.previewTextGray
                                : styles.previewTextBlack
                            } // Change text color based on seen property
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>Wow! so empty.</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <TabPanel value={tabvalue} index={0}>
                <Typography variant="h6" sx={{ mt: 1, flexGrow: 1, mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold", // ضخیم‌تر کردن متن
                      fontSize: { xs: "1.5rem", sm: "2rem" }, // اندازه متغیر برای موبایل و دسکتاپ
                      textAlign: "center", // متن در وسط
                    }}
                  >
                    Welcome, {name} {lastName}!
                  </Typography>
                </Typography>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox elevation={3} component="a">
                      <FavoriteIcon fontSize="large" />
                      <Typography variant="subtitle1">Favorite Tab</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox
                      elevation={3}
                      component="a"
                      onClick={editProfile}
                    >
                      <EditIcon fontSize="large" />
                      <Typography variant="subtitle1">Edit Profile</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox
                      elevation={3}
                      component="a"
                      onClick={handleLogout}
                    >
                      <ExitToApp fontSize="large" />
                      <Typography variant="subtitle1">Log out</Typography>
                    </NavigationBox>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabvalue} index={1}>
              <Typography
  variant="h4"
  sx={{
    mt: 1, // فاصله از بالا
    mb: 3, // فاصله از پایین
    fontWeight: 'bold', // ضخیم‌تر کردن متن
    fontSize: { xs: '1.5rem', sm: '2rem' }, // اندازه فونت برای موبایل و دسکتاپ
    textAlign: 'center', // متن در وسط
  }}
>
  Your School
</Typography>

                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox
                      elevation={3}
                      component="a"
                      onClick={viewClasses}
                    >
                      <Class fontSize="large" />
                      <Typography variant="subtitle1">Enter Classes</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox elevation={3} onClick={fetchCalendar}>
                      <PermContactCalendar fontSize="large" />
                      <Typography variant="subtitle1">
                        School Calendar
                      </Typography>
                    </NavigationBox>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabvalue} index={2}>
              <Typography
  variant="h4"
  sx={{
    mt: 1, // فاصله از بالا
    mb: 3, // فاصله از پایین
    fontWeight: 'bold', // ضخیم‌تر کردن متن
    fontSize: { xs: '1.5rem', sm: '2rem' }, // اندازه متغیر برای موبایل و دسکتاپ
    textAlign: 'center', // متن در وسط
  }}
>
  Test & Planning
</Typography>

                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox
                      elevation={3}
                      component="a"
                      onClick={gotoHollandtest}
                    >
                      <QuizIcon fontSize="large" />
                      <Typography variant="subtitle1">Holland Test</Typography>
                    </NavigationBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <NavigationBox
                      elevation={3}
                      component="a"
                      onClick={gotoAcademicPlanning}
                    >
                      <QuizIcon fontSize="large" />
                      <Typography variant="subtitle1">
                        Academic Planning
                      </Typography>
                    </NavigationBox>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabvalue} index={6}>
              <AppWrapper onBack={() => handleTabChange(0)} /> {/* ارسال تابع بک */}
            </TabPanel>
              <TabPanel value={tabvalue} index={4}>
                <StudentClassList goBack={() => handleTabChange(1)} />
              </TabPanel>
              <TabPanel value={tabvalue} index={5}>
              <TabPanel value={tabvalue} index={5}>
              <HollandTest goBack={() => settabvalue(2)} gotoQuestions={() => settabvalue(10)} gotoResults={() => settabvalue(8)}/>
            </TabPanel>
              </TabPanel>
              <TabPanel value={tabvalue} index={10}>
                <HollandQuestions gotoAnalize={() => handleTabChange(7)} />
              </TabPanel>
              <TabPanel value={tabvalue} index={7}>
                <HollandResults
                  goBack={() => handleTabChange(2)}
                  gotoHolland={() => handleTabChange(5)}
                />
              </TabPanel>
              <TabPanel value={tabvalue} index={8}>
                <PreviousResults goBack={() => handleTabChange(2)} />
              </TabPanel>
              <Box padding={2}>
                <TabPanel value={tabvalue} index={9}>
                  <Planner onBack={() => handleTabChange(2)} />
                </TabPanel>
              </Box>
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
                onClick={() => handleTabChange(0)}
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
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabChange(1)}
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
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="School" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabChange(2)}
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
                <ListItemText primary="Academic Consult" />
              </ListItem>
              <ListItem
                button
                onClick={handleLogout}
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
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: '600', textAlign: 'left', paddingLeft: '10px' }} variant='h5'>
                Recent events:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box onClick={toggleDescriptiveQuizzes} sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', margin: '2px' }}>
                  <IconButton color="primary" sx={{width:'12%'}}>
                    {showDescriptiveQuizzes ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <Typography variant="button" sx={{ color: 'white', cursor: 'pointer' }}>
                    {showDescriptiveQuizzes ? 'Hide Descriptive Quizzes' : 'Show Descriptive Quizzes'}
                  </Typography>
                </Box>
                <Collapse in={showDescriptiveQuizzes}>
                  <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                    {quizExplans.length > 0 ? (
                      quizExplans.map(qe => (
                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBlock: '5px' }} key={qe.id}>
                          <Box sx={{ backgroundColor:'lavender', display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderColor: 'white', borderRadius: '1rem', minWidth: '60px' }}>
                            <Typography variant='h3' sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getDay(qe.OpenTime)}</Typography>
                            <Typography sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getMonth(qe.OpenTime)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {isStarted(qe.OpenTime) ? (
                              <Typography
                                variant='h6'
                                sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                onClick={() => handleDescriptiveQuizClick(qe.class_id, qe)}>
                                  {qe.Title}
                              </Typography>
                            ) : (
                              <Typography
                                variant='h6'
                                sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>
                                  {qe.Title}
                              </Typography>
                            )}
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{qe.class_topic} class</Typography>
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{getRemainingTimeQ(qe.OpenTime, qe.DurationHour, qe.DurationMinute)}</Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>There are no descriptive quizzes yet!</Typography>
                    )}
                  </Box>
                </Collapse>

                <Box onClick={toggleTestQuizzes} sx={{ display: 'flex', flexDirection: 'row', cursor:  'pointer', alignItems: 'center', margin: '2px' }}>
                  <IconButton color="primary" sx={{width:'12%'}}>
                    {showTestQuizzes ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <Typography variant="button" sx={{ color: 'white', cursor: 'pointer' }}>
                    {showTestQuizzes ? 'Hide Test Quizzes' : 'Show Test Quizzes'}
                  </Typography>
                </Box>
                <Collapse in={showTestQuizzes}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {quizTests.length > 0 ? (
                      quizTests.map(qt => (
                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBlock: '5px' }} key={qt.id}>
                          <Box sx={{ backgroundColor:'lavender', display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderColor: 'white', borderRadius: '1rem', minWidth: '60px' }}>
                            <Typography variant='h3' sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getDay(qt.OpenTime)}</Typography>
                            <Typography sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getMonth(qt.OpenTime)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {isStarted(qt.OpenTime) ? (
                                <Typography
                                  variant='h6'
                                  sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                  onClick={() => handleTestQuizClick(qt.class_id, qt)}>
                                    {qt.Title}
                                </Typography>
                              ) : (
                                <Typography
                                  variant='h6'
                                  sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>
                                    {qt.Title}
                                </Typography>
                            )}
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{qt.class_topic} class</Typography>
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{getRemainingTimeQ(qt.OpenTime, qt.DurationHour, qt.DurationMinute)}</Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>There are no test quizzes yet!</Typography>
                    )}
                  </Box>
                </Collapse>

                <Box onClick={toggleHomeworks} sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', margin: '2px' , marginInline:'' }}>
                  <IconButton color="primary" sx={{width:'12%'}}>
                    {showHomeworks ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <Typography variant="button" sx={{ color: 'white', cursor: 'pointer' }}>
                    {showHomeworks ? 'Hide Homeworks' : 'Show Homeworks'}
                  </Typography>
                </Box>
                <Collapse in={showHomeworks}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {homeworks.length > 0 ? (
                      homeworks.map(hw => (
                        <Box sx={{ display: 'flex', flexDirection: 'row', marginBlock: '5px' }} key={hw.id}>
                          <Box sx={{ backgroundColor:'lavender', display: 'flex', flexDirection: 'column', borderStyle: 'solid', borderWidth: '1px', borderColor: 'white', borderRadius: '1rem', minWidth: '60px' }}>
                            <Typography variant='h3' sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getDay(hw.DeadLine)}</Typography>
                            <Typography sx={{ fontWeight: '550', alignSelf: 'center', color:'black' }}>{getMonth(hw.DeadLine)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                              variant='h6'
                              sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                              onClick={() => handleHomeworkClick(hw.class_id, hw.id)}>
                                {hw.Title}
                            </Typography>
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{hw.class_topic} class</Typography>
                            <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>{getRemainingTimeHW(hw.DeadLine)}</Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography sx={{ color: 'white', textAlign: 'left', paddingLeft: '5px' }}>There are no homeworks yet!</Typography>
                    )}
                  </Box>
                </Collapse>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentDashboard;
