import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Box, Container, Grid, Paper, TextField, Typography,Dialog, DialogActions,ListItemIcon ,DialogContent, DialogTitle , CssBaseline, Button, Avatar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ExitToApp, Menu, Class, Person, PersonAdd, School, Person4, HomeWork, NotificationAdd, PermContactCalendar, Security } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { styled } from '@mui/system';
import Swal from "sweetalert2";
import SignUpStudent from "./add-student/add-student";
import SignUpTeacher from "./add-teacher/add-teacher";
import AddClass from "./add-class/AddClass";
import AppWrapper from "./ProfileAdmin";
import { useMediaQuery } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePrincipal } from '../context/PrincipalContext';
import './SchoolDashboard.css';
import Discipline from "../discipline/Discipline"
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import StudentList from "./StudentList";
import TeacherList from './TeacherList';


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
};
const customCss = `
    .ql-editor {
        font-size: 14px;
    }
`;

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

const NavigationBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
  width: '200px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SchoolInfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const SchoolDashboard = () => {
  const initialTabValue = parseInt(localStorage.getItem('activeTab')) || 0;
  const [tabvalue, settabvalue] = useState(initialTabValue);
  const [openmessagebox, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openCalendar, setOpencalendar] = useState(false);
  const [eventFlag, setEventFlag] = useState('');
  const [description, setDescription] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');

  const [openParentMessageBox, setOpenParentMessageBox] = useState(false);
const [parentMessage, setParentMessage] = useState('');
const [parentNotifications, setParentNotifications] = useState([]);
const [openParentNotifications, setOpenParentNotifications] = useState(false);

// Open/Close dialogs
const handleParentMessageClickOpen = () => {
  setOpenParentMessageBox(true);
};
const handleParentMessageClickClose = () => {
  setOpenParentMessageBox(false);
};
const handleParentNotificationsClickOpen = () => {
  fetchParentNotifications();
  setOpenParentNotifications(true);
};
const handleParentNotificationsClickClose = () => {
  setOpenParentNotifications(false);
};

// Fetch parent notifications
const fetchParentNotifications = useCallback(async () => {
  try {
    const fetchParentNotifResponse = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/notification/notify/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (fetchParentNotifResponse.ok) {
      const parentNotifData = await fetchParentNotifResponse.json();
      setParentNotifications(parentNotifData);
    } else {
      console.error('Failed to fetch parent notifications');
    }
  } catch (error) {
    console.error('Error fetching parent notifications:', error);
  }
}, []);


// Send notification to parents
const handleSendParentMessage = async (e) => {
  handleParentMessageClickClose();
  e.preventDefault();
  try {
    const submitParentNotifResponse = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/notification/add_notification/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: parentMessage,
        }),
      }
    );

    if (!submitParentNotifResponse.ok) {
      const errorData = await submitParentNotifResponse.json();
      Swal.fire('Error', errorData.message || 'Failed to send notification.', 'error');
    } else {
      Swal.fire('Success', 'Notification sent to parents!', 'success');
    }
  } catch (error) {
    Swal.fire('Error', 'Server error or network issue.', 'error');
    console.error('Error:', error);
  }
  setParentMessage('');
};



  const formatDatetime = (datetime) => {
     const date = new Date(datetime);
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
  };
  const handleClickOpenCalendar = () => {
    setOpencalendar(true);
  };

  const handleCloseClendar = () => {
    setOpencalendar(false);
  };

  const handleTabChange = (newTabValue) => {
    settabvalue(newTabValue);
    localStorage.setItem('activeTab', newTabValue); // ذخیره‌سازی مقدار تب در localStorage
  };
  const goToProfileTab = () => {
    handleTabChange(6); // مقدار 6 همان تب پروفایل است
  };

  const handleMessageClickOpen = () => {
      setOpen(true);
  };

  const handleMessageClickClose = () => {
      setOpen(false);
  };
  const [profileImage, setProfileImage] = useState(null);

  const handleAddEvent = async (e) =>{
    e.preventDefault();
    try {
      const submit = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/teacher/principal-add-event/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
      body: JSON.stringify({
        flag: eventFlag,
        description: description,
        start: startDatetime,
        end: endDatetime,
      }),
    })
    if (!submit.ok) {
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
    } else {
      Swal.fire('Success', 'Event Added Successfully!', 'success');
    }

  } catch (error) 
  {
    Swal.fire('Error', 'Connect Your Google Account First!', 'error');
    console.error('Error:', error);
  }
  handleCloseClendar();
};

useEffect(() => {
  const fetchProfileImage = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/user/profile/`, {
        credentials: "include",
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.UserProfile[0]?.profile_image) {
          setProfileImage(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${data.UserProfile[0]?.profile_image}`);
        } else {
          setProfileImage(null); // مسیر پیش‌فرض اگر تصویر نباشد
        }
      }
    } catch (error) {
      console.error("Error fetching profile image", error);
    }
  };

  fetchProfileImage();
}, []);


  const handleSendMessage = async (e) => {
    handleMessageClickClose();
      e.preventDefault();
      try {
        const submit = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/add_notification/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({
            message: message}),
        });
        if (!submit.ok) {
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
              text: errorMessage || 'Failed to send notificaiton. Please check the details and try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire('Error', 'An unknown error occurred. Please try again later.', 'error');
          }
        } else {
          Swal.fire('Success', 'Sent!', 'success');
        }
    
      } catch (error) 
      {
        Swal.fire('Error', 'Server error or network issue. Please try again.', 'error');
        console.error('Error:', error);
      }
    setMessage('');
  };
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { schoolToken ,logoutSchool} = useSchool();
  const { principal ,logoutPrincipal} = usePrincipal();
  const [school, setSchool] = useState(null);
  const [principalInfo, setPrincipalInfo] = useState(null);
  const [openSentNotifications, setOpenSentNotifications] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const sortedParentNotifications = [...parentNotifications].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleSentNotificationsClickOpen = () => {
    fetchSentNotifications();
    setOpenSentNotifications(true);
  };
  const handleSentNotificationsClickClose = () => {
    setOpenSentNotifications(false);
};
const createPreview = (message) => {
  const plainText = message.replace(/<[^>]+>/g, ''); // Strip HTML tags
  const preview = plainText.split(' ').slice(0, 10).join(' ') + '...'; // Take first 10 words
  return preview;
};
const [selectedNotification, setSelectedNotification] = useState(null);
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' , hour: 'numeric', minute: 'numeric'};
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};
  const fetchSentNotifications = useCallback(async () => {
    if (!schoolToken) return;
    try {
      const fetchnotifresponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/notify/`, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (fetchnotifresponse.ok) {
        const notifdata = await fetchnotifresponse.json();
        setSentNotifications(notifdata);
      } else {
        console.error('Failed to fetch notif list');
      }
    } catch (error) {
      console.error('Error fetching notif list:', error);
    }}, [schoolId, schoolToken]);

    const handleLogout = async () => {
      try {
        const adminLogoutResponse = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/logout_school/`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (!adminLogoutResponse.ok) {
          throw new Error("Failed to logout admin");
        }
        const schoolLogoutResponse = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/logout/`,
          {
            method: "POST",
            credentials: "include",
          }
        );
    
        if (!schoolLogoutResponse.ok) {
          throw new Error("Failed to logout school");
        }
    
        // ذخیره پیام خروج در localStorage
        localStorage.setItem("logoutMessage", "You have been logged out successfully.");
    
        logoutPrincipal();
        logoutSchool();
    
        // انتقال به صفحه اصلی
        navigate("/");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to logout completely. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    

  const fetchSchoolData = useCallback(async () => {
    if (!schoolToken) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/school/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const selectedSchool = data.find(school => school.id === parseInt(schoolId));
        setSchool(selectedSchool);
      } else {
        console.error('Failed to fetch school data');
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
    }
  }, [schoolId, schoolToken]);

  const fetchCalendar = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/prinicipal-google-calendar/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        Swal.fire("Error", "Failed to fetch classes", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Network error while fetching classes", "error");
    }
  },[schoolId]);

  const fetchPrincipalData = useCallback(async () => {
    if (!principal?.jwt) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/user/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPrincipalInfo(data);
      } else {
        console.error('Failed to fetch principal data');
      }
    } catch (error) {
      console.error('Error fetching principal data:', error);
    }
  }, [principal?.jwt]);

  useEffect(() => {
    fetchSchoolData();
    fetchPrincipalData();
  }, [fetchSchoolData, fetchPrincipalData]);

  const addStudent = () => handleTabChange(3);
  const addTeacher = () => handleTabChange(4);
  const viewClasses = () => handleTabChange(5);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isDesktop = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:599px)');
  const sortedNotifications = [...sentNotifications].sort((a, b) => new Date(b.date) - new Date(a.date));
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };
  const handleBackClick = () => {
    setSelectedNotification(null);
  };
  const handleSwitchSchool = () => {
    localStorage.removeItem('activeTab'); // حذف تب ذخیره‌شده از localStorage
    navigate('/admin-school'); // هدایت به صفحه Switch School
  };

  const isFormValid = () => {
    return eventFlag !== '' && description !== '' && startDatetime !== '' && endDatetime !== '';
  };

  // Add these state variables
const [showFeeDialog, setShowFeeDialog] = useState(false);
const [fees, setFees] = useState([]);
const [feePayments, setFeePayments] = useState([]);
const [newFee, setNewFee] = useState({
  Year: new Date().getFullYear(),
  Month: new Date().getMonth() + 1,
  Amount: '',
});

// Add these handler functions
const handleFeeDialogOpen = () => {
  fetchFees();
  fetchFeePayments();
  setShowFeeDialog(true);
};

const handleFeeDialogClose = () => {
  setShowFeeDialog(false);
  setNewFee({
    Year: new Date().getFullYear(),
    Month: new Date().getMonth() + 1,
    Amount: '',
  });
};

const handleAddChangeFee = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/principal-add-change-fee/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newFee),
      }
    );

    if (response.ok) {
      Swal.fire('Success', 'Fee has been added/updated successfully', 'success');
      fetchFees();
      handleFeeDialogClose();
    } else {
      const errorData = await response.json();
      Swal.fire('Error', errorData.message || 'Failed to add/update fee', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', 'Server error or network issue', 'error');
  }
};

const fetchFees = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/principal-fee-list/`,
      {
        credentials: 'include',
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log('Raw fee data:', data);
      // Transform the data to ensure it has all required fields
      const transformedData = data.map((fee, index) => ({
        id: fee.id || index, // Ensure each row has a unique id
        Year: fee.Year || '',
        Month: fee.Month || '',
        Amount: fee.Amount || 0,
        Is_Sent: fee.Is_Sent || false
      }));
      setFees(transformedData);
    }
  } catch (error) {
    console.error('Error fetching fees:', error);
  }
};

const fetchFeePayments = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/principal-fee-paid-list/`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    if (response.ok) {
      const data = await response.json();
      // Transform the data to ensure it has all required fields
      const transformedData = data.map((payment, index) => ({
        id: payment.id || index,
        last_name: payment.last_name || '',
        National_ID: payment.National_ID || '',
        Year: payment.Year || '',
        Month: payment.Month || '',
        Amount: payment.Amount || 0,
        Is_Paid: payment.Is_Paid || false
      }));
      setFeePayments(transformedData);
    }
  } catch (error) {
    console.error('Error fetching fee payments:', error);
  }
};

const handleSendFee = async (feeId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/student/principal-send-fee/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: feeId }),
      }
    );
    if (response.ok) {
      
      fetchFees();
      fetchFeePayments();
    } else {
      const errorData = await response.json();
      
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', 'Server error or network issue', 'error');
  }
};
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <AppBar
  position="fixed"
  sx={{
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    height: '56px', // تنظیم ارتفاع ثابت
  }}
>
  <Toolbar>
    <Grid container alignItems="center" justifyContent="space-between">
      {/* ستون اول: همبرگر و آواتار */}
      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ padding: '4px', marginRight: '8px' }} // فاصله بین همبرگر و آواتار
          >
            <Menu />
          </IconButton>
        )}
        <Avatar
          alt="Profile Picture"
          src={profileImage || "/default-avatar.png"}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              boxShadow: 3,
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
          onClick={() => handleTabChange(6)}
        />
      </Grid>

      <Grid item xs>
      <Typography
  variant="h6"
  sx={{
    fontSize: '1.2rem', 
    textAlign: 'center', 
    color: 'white', 
  }}
>
  {principalInfo ? `${principalInfo.first_name} ${principalInfo.last_name}` : 'Loading...'}
</Typography>

      </Grid>

      {/* ستون سوم: دکمه خروج */}
      <Grid item>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="logout"
          onClick={handleLogout}
          sx={{ padding: '4px' }}
        >
          <ExitToApp />
        </IconButton>
      </Grid>
    </Grid>
  </Toolbar>
</AppBar>




        <Toolbar />
        <Box sx={{   position: { xs: "relative", sm: "absolute" },
        left: { xs: "0px", sm: "190px" },
        right: { xs: "10px", sm: "80px" },
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
          <Box component="main" sx={{ flexGrow: 1, mt : 4 }}>
            <Container maxWidth="lg"
            >
             {school && tabvalue !== 5 && tabvalue!== 4 && tabvalue !==3 && tabvalue!==6 && tabvalue!==7 &&(  // نمایش فقط در تب‌های غیر از Manage Classes
            <SchoolInfoBox elevation={3}>
              <HomeWork fontSize="large" />
              <Box>
                <Typography variant="h6">{school.School_Name}</Typography>
                <Typography variant="body1">{school.City}, {school.Province}</Typography>
              </Box>
            </SchoolInfoBox>
            )}

              <TabPanel value={tabvalue} index={0}>
              <Typography
  variant="h4"
  sx={{
    fontWeight: "bold", // ضخیم‌تر کردن متن
    fontSize: { xs: "1.5rem", sm: "2rem" }, // اندازه متن برای موبایل و دسکتاپ
    textAlign: "center", // متن وسط‌چین
    mt: 2, // فاصله از بالا
    mb: 3, // فاصله از پایین
  }}
>
  Welcome {principalInfo ? `${principalInfo.first_name} ${principalInfo.last_name}` : 'Loading...'}!
</Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a">
                    <Class fontSize="large" />
                    <Typography variant="subtitle1">Last visited Page</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={() => handleTabChange(6)}>
                    <PersonAdd fontSize="large" />
                    <Typography variant="subtitle1">Edit Profile</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={handleLogout}>
                    <School fontSize="large" />
                    <Typography variant="subtitle1">Log out</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
              </TabPanel>

              <TabPanel value={tabvalue} index={1}>
              <Typography
  variant="h4"
  sx={{
    fontWeight: "bold", // ضخیم‌تر کردن متن
    fontSize: { xs: "1.5rem", sm: "2rem" }, // اندازه متن برای موبایل و دسکتاپ
    textAlign: "center", // متن وسط‌چین
    mt: 2, // فاصله از بالا
    mb: 3, // فاصله از پایین
  }}
>
  Classes Management
</Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={viewClasses}>
                    <Class fontSize="large" />
                    <Typography variant="subtitle1">Manage Classes</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={addTeacher}>
                    <PersonAdd fontSize="large" />
                    <Typography variant="subtitle1">Add Teacher</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={addStudent}>
                    <School fontSize="large" />
                    <Typography variant="subtitle1">Add Student</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} onClick={handleMessageClickOpen}>
                    <NotificationAdd fontSize="large" />
                    <Typography variant="subtitle1">Send Notifications</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
              </TabPanel>

            <TabPanel value={tabvalue} index={2}>
            <Typography
  variant="h4"
  sx={{
    fontWeight: "bold", // ضخیم‌تر کردن متن
    fontSize: { xs: "1.5rem", sm: "2rem" }, // اندازه متن برای موبایل و دسکتاپ
    textAlign: "center", // متن وسط‌چین
    mt: 2, // فاصله از بالا
    mb: 3, // فاصله از پایین
  }}
>
  Office Automation
</Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <NavigationBox elevation={3} component="a" onClick={() => handleTabChange(8)}>
                    <Person fontSize="large" />
                    <Typography variant="subtitle1">Student Files</Typography>
                </NavigationBox>

                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
  <NavigationBox elevation={3} component="a" onClick={() => handleTabChange(9)}>
    <Person4 fontSize="large" />
    <Typography variant="subtitle1">Teacher Files</Typography>
  </NavigationBox>
</Grid>

                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} onClick={() => handleTabChange(7)}>
                    <Security fontSize="large" />
                    <Typography variant="subtitle1">Disciplinary management</Typography>
                  </NavigationBox>
              </Grid>

                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} onClick={handleClickOpenCalendar}>
                    <PermContactCalendar fontSize="large" />
                    <Typography variant="subtitle1">Calendar</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
  <NavigationBox elevation={3} onClick={handleParentMessageClickOpen}>
    <NotificationAdd fontSize="large" />
    <Typography variant="subtitle1">Send Parent Notifications</Typography>
  </NavigationBox>
</Grid>
<Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
  <NavigationBox elevation={3}
    onClick={handleFeeDialogOpen}
  >
    <MonetizationOnIcon sx={{ fontSize: 40, mb: 1 }} />
    <Typography variant="h6" gutterBottom>
      Fee & Payments
    </Typography>
  </NavigationBox>
</Grid>

              </Grid>
            </TabPanel>
            <TabPanel value={tabvalue} index={3}>
              <SignUpStudent goBack={() => handleTabChange(1)} />
              {/* <Button variant="contained" color="secondary" onClick={() => settabvalue(1)}>
              <ArrowBackIcon />
              Back
               </Button> */}
            </TabPanel>
            <TabPanel value={tabvalue} index={4}>
              <SignUpTeacher goBack={() => handleTabChange(1)} /> {/* ارسال تابع برای بازگشت */}
          </TabPanel>

            <TabPanel value={tabvalue} index={5}>
            <AddClass goBack={() => handleTabChange(1)} />
              {/* <Button variant="contained" color="secondary" onClick={() => settabvalue(1)}>
              <ArrowBackIcon />
              Back
               </Button> */}
            </TabPanel>
            <TabPanel value={tabvalue} index={6}>
              <AppWrapper onBack={() => handleTabChange(0)} /> {/* ارسال تابع بک */}
            </TabPanel>

            <TabPanel value={tabvalue} index={7}>

            <Discipline onBack={() => handleTabChange(2)} />

</TabPanel>
<TabPanel value={tabvalue} index={8}>
  <StudentList onBack={() => handleTabChange(2)} />
</TabPanel>
<TabPanel value={tabvalue} index={9}>
  <TeacherList onBack={() => handleTabChange(2)} />
</TabPanel>



            </Container>
          </Box>
          {isDesktop ? (
            <Drawer variant="permanent" anchor="left" sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.drawer, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
            <Toolbar />
            <List>
              <ListItem button component="a"    onClick={handleSwitchSchool} // فراخوانی تابع

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
                  <SwapHorizIcon />
                </ListItemIcon>
                <ListItemText primary="Switch School" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(0)} 
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
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(1)}
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
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Classes" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(2)}
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
                <ListItemText primary="Office" />
              </ListItem>
            </List>
          </Drawer>          
          ) : (
            <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.drawer, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
              <Toolbar />
              <List>
              <ListItem button component="a"  onClick={() => navigate('/admin-school')}
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
                  <SwapHorizIcon />
                </ListItemIcon>
                <ListItemText primary="Switch School" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(0)}
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
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(1)}
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
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Classes" />
              </ListItem>
              <ListItem button onClick={() => handleTabChange(2)}
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
                <ListItemText primary="Office" />
              </ListItem>
            </List>
            </Drawer>
          )}
        </Box>
        {/* {!isDesktop && (
          <Box sx={{ position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
            <Button variant="contained" color="primary" onClick={toggleSidebar}>
              <Menu />
            </Button>
          </Box>
        )} */}
      <Dialog open={openCalendar} onClose={handleCloseClendar}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
        <Button variant="outlined" color="primary" onClick={fetchCalendar}>
            Google Calendar
          </Button>
          <TextField
            required
            autoFocus
            margin="dense"
            id="flag"
            label="Event Flag"
            type="text"
            fullWidth
            variant="standard"
            value={eventFlag}
            onChange={(e) => setEventFlag(e.target.value)}
          />
          <TextField
          required
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
          required
            margin="dense"
            id="startDatetime"
            label="Start Date and Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
          required
            margin="dense"
            id="endDatetime"
            label="End Date and Time"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClendar} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="primary" disabled={!isFormValid()}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
            <Dialog open={openmessagebox} onClose={handleMessageClickClose}>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogContent>
                    <ReactQuill value={message} onChange={setMessage} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMessageClickClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendMessage} color="primary">
                        Send
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSentNotificationsClickOpen}>
                        View Sent Notifications
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSentNotifications} onClose={handleSentNotificationsClickClose} maxWidth="md" fullWidth>
                <DialogTitle style={styles.dialogTitle}>Sent Notifications</DialogTitle>
                <DialogContent style={styles.dialogContent}>
                {selectedNotification ? (
                    <Box style={styles.messageContainer}>
                        <Button onClick={handleBackClick} color="primary">Back</Button>
                        <div style={styles.messageContent} dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
                        <Typography variant="body2" style={styles.dateText}>{formatDate(selectedNotification.date)}</Typography>
                    </Box>
                    ) : (
                    <List style={styles.list}>
                        {sortedNotifications.map((notification) => (
                            <ListItem key={notification.id} style={styles.listItem}
                            button
                            onClick={() => handleNotificationClick(notification)} 
                            >
                                <ListItemText 
                                    primary={
                                        <div>
                                            <Typography style={styles.dateText}>
                                                {formatDate(notification.date)}
                                            </Typography>
                                            <Typography style={styles.listItemText}>
                                                {createPreview(notification.message)}
                                            </Typography>
                                        </div>
                                    }
                                    style={styles.previewText}
                                />
                            </ListItem>
                        ))}
                    </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSentNotificationsClickClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openParentMessageBox} onClose={handleParentMessageClickClose}>
  <DialogTitle>Send Notification to Parents</DialogTitle>
  <DialogContent>
    <ReactQuill value={parentMessage} onChange={setParentMessage} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleParentMessageClickClose} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSendParentMessage} color="primary">
      Send
    </Button>
    <Button variant="contained" color="primary" onClick={handleParentNotificationsClickOpen}>
      View Sent Notifications
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={openParentNotifications} onClose={handleParentNotificationsClickClose} maxWidth="md" fullWidth>
  <DialogTitle style={styles.dialogTitle}>Sent Notifications to Parents</DialogTitle>
  <DialogContent style={styles.dialogContent}>
  {selectedNotification ? (
    <Box style={styles.messageContainer}>
      <Button onClick={() => setSelectedNotification(null)} color="primary">Back</Button>
      <div dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
      <Typography variant="body2" style={styles.dateText}>
        {formatDate(selectedNotification.date)}
      </Typography>
    </Box>
  ) : (
    <List style={styles.list}>
      {sortedParentNotifications.map((notification) => (
        <ListItem 
          key={notification.id} 
          button 
          onClick={() => setSelectedNotification(notification)}
          style={styles.listItem}
        >
          <ListItemText
            primary={
              <>
                <Typography style={styles.dateText}>
                  {formatDate(notification.date)}
                </Typography>
                <Typography style={styles.listItemText}>
                  {createPreview(notification.message)}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  )}
</DialogContent>

  <DialogActions>
    <Button onClick={handleParentNotificationsClickClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

<Dialog 
  open={showFeeDialog} 
  onClose={handleFeeDialogClose}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ 
    bgcolor: theme.palette.primary.main, 
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    Fee & Payments Management
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleFeeDialogClose}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ mt: 2 }}>
    <Grid container spacing={3}>
      {/* Fee Management Form */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add/Change Fee
          </Typography>
          <TextField
            fullWidth
            label="Year"
            type="number"
            value={newFee.Year}
            onChange={(e) => setNewFee({ ...newFee, Year: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Month"
            type="number"
            value={newFee.Month}
            onChange={(e) => setNewFee({ ...newFee, Month: Math.min(12, Math.max(1, e.target.value)) })}
            inputProps={{ min: 1, max: 12 }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={newFee.Amount}
            onChange={(e) => setNewFee({ ...newFee, Amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddChangeFee}
            startIcon={<MonetizationOnIcon />}
          >
            Add/Change Fee
          </Button>
        </Paper>
      </Grid>

      {/* Fee List */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fee List
          </Typography>
          <Box sx={{ height: 400 }}>
          <DataGrid
  rows={fees}
  columns={[
    { field: 'Year', headerName: 'Year', width: 100 },
    { field: 'Month', headerName: 'Month', width: 100 },
    { 
      field: 'Amount', 
      headerName: 'Amount', 
      width: 130,
      // Simplified valueFormatter
      renderCell: (params) => (
        <Typography>
          ${params.row.Amount}
        </Typography>
      )
    },
    { 
      field: 'Is_Sent', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        params.row.Is_Sent ? 
        <Button disabled variant="contained" color="success" size="small">
          Sent
        </Button> :
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          onClick={() => handleSendFee(params.row.id)}
        >
          Send
        </Button>
      )
    }
  ]}
  pageSize={5}
  disableSelectionOnClick
/>
          </Box>
        </Paper>
      </Grid>

      {/* Payment Status */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Payment Status
          </Typography>
          <Box sx={{ height: 400 }}>
          <DataGrid
  rows={feePayments}
  columns={[
    { field: 'last_name', headerName: 'last_name', width: 200 },
    { field: 'Year', headerName: 'Year', width: 100 },
    { field: 'Month', headerName: 'Month', width: 100 },
    { 
      field: 'National_ID', 
      headerName: 'National_ID', 
      width: 130 
    },

    { 
      field: 'Is_Paid', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Button 
          variant="contained" 
          color={params.row.Is_Paid ? "success" : "error"}
          size="small"
          disabled
        >
          {params.row.Is_Paid ? "Paid" : "Unpaid"}
        </Button>
      )
    }
  ]}
  pageSize={5}
  disableSelectionOnClick
/>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleFeeDialogClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


      </Box>
    </ThemeProvider>
  );
};

export default SchoolDashboard;
