import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import { useStudent } from '../context/StudentContext';
import { MdHome, MdClass, MdNotifications, MdExitToApp, MdHomeWork ,MdCalendarToday } from 'react-icons/md';
import { CgProfile  } from "react-icons/cg";
import { Button, List, ListItem, ListItemText, Dialog,  DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './dashboard.css';

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
const StudentDashboard = () => {
  const [open, setOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const { student, logoutStudent } = useStudent();
  const [name, setName] = useState(student ? student.first_name : '');
  const [nofunseen, setcount] = useState(0);
  const [lastName, setLastName] = useState(student ? student.last_name : '');
  const token = student?.jwt;
  const [value, setValue] = React.useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showClasses = () => {
    navigate('./student-classes');
  };

  const handleClickOpen = () => {
    // Fetch unread notifications from API
    fetchUnreadNotifications();
    setOpen(true);
  };
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };
  const handleBackClick = () => {
    setSelectedNotification(null);
};
  const handleClose = () => {
      setOpen(false);
  };

  const handleAddToCalendar = () => {
    fetchCalendar();
  };
  const fetchCalendar =  useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/student-google-calendar/", {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } else {
        console.error('Failed to fetch class list');
      }
    } catch (error) {
      console.error('Error fetching class list:', error);
    }
  }, [token]);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const fetchnotifresponse = await fetch("http://127.0.0.1:8000/api/notifications/", {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (fetchnotifresponse.ok) {
        const notifdata = await fetchnotifresponse.json();
        setUnreadNotifications(notifdata);
      } else {
        console.error('Failed to fetch notif list');
      }
    } catch (error) {
      console.error('Error fetching notif list:', error);
    }}, [token]);

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/student/user/', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const studentData = await response.json();
        setName(studentData.first_name);
        setLastName(studentData.last_name);
      } else {
        console.error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  }, [token]);

  const fetchnumberofunread = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/unseen_notifications/', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const studentData = await response.json();
        setcount(studentData.count);
      } else {
        console.error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchnumberofunread();
      fetchStudentData();
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [token, fetchStudentData]);

  const handleLogout = () => {
    logoutStudent();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/dashboard/profile-student');
  };

  const handleHollandTest = () => {
    navigate('/student-dashboard/holland-test');
  };
  const createPreview = (message) => {
    const plainText = message.replace(/<[^>]+>/g, ''); // Strip HTML tags
    const preview = plainText.split(' ').slice(0, 5).join(' ') + '...'; // Take first 10 words
    return preview;
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };
const renderTabs = () => (
    <Tabs value={value} onChange={handleChange} className='stu-dashboard-nav'>
        <Tab icon={<CgProfile size={22} />} label="Profile" onClick={handleProfile} />
        <Tab icon={<MdHome size={22} />} label="Home" />
        <Tab icon={<MdClass size={22} />} label="Classes" />
        <Tab icon={<MdHomeWork size={22} />} label="Consultation Tests" />
        <Tab icon={<MdNotifications size={22} />} label= {`Notifications (${nofunseen})`} />
        <Tab icon={<MdCalendarToday size={22} />} label="School Calendar" />
        <Tab icon={<MdExitToApp size={22} />} label="Log Out" onClick={handleLogout} />
    </Tabs>
);

  const renderMenu = () => (
    <Menu right>
      <a onClick={handleProfile} className="menu-item">Profile</a>
      <a onClick={() => setValue(1)} className="menu-item">Home</a>
      <a onClick={() => setValue(2)} className="menu-item">Classes</a>
      <a onClick={() => setValue(3)} className="menu-item">Consultation Tests</a>
      <a onClick={() => setValue(4)} className="menu-item">Notifications</a>
      <a onClick={() => setValue(5)} className="menu-item">School Calendar</a>
      <a onClick={handleLogout} className="menu-item">Log Out</a>
    </Menu>
  );
  const sortedNotifications = [...unreadNotifications].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }} className='stu-dashboard'>
      <div className="tab-container">
        {isMobile ? renderMenu() : renderTabs()}
        <TabPanel value={value} index={0}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>Profile</Typography>
          <Typography variant="body1">Manage your profile here.</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>Home</Typography>
          <Typography variant="body1">Welcome, {name} {lastName}!</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>Classes</Typography>
          <Typography variant="body1">You can see your classes in here.</Typography>
          <button 
            onClick={showClasses} 
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
          >
            Class List
          </button>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>Consultation Tests</Typography>
          <Typography variant="body1">Select a test to proceed:</Typography>
          <button
            onClick={handleHollandTest}
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
          >
            Holland Test
          </button>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>Notifications</Typography>
          <Typography variant="body1">You can see Notifications here:</Typography>
          <div>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                View Unread Notifications
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle style={styles.dialogTitle}>Unread Notifications</DialogTitle>
                <DialogContent style={styles.dialogContent}>
                    {selectedNotification ? (
                    <Box style={styles.messageContainer}>
                        <Button onClick={handleBackClick} color="primary">Back</Button>
                        <div style={styles.messageContent} dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
                        <Typography variant="body2" style={styles.dateText}>{formatDate(selectedNotification.date)}</Typography>
                    </Box>
                    ) : (
                        <List style={styles.list}>
                            {sortedNotifications.map((notification, index) => (
                                <ListItem 
                                    key={notification.id} 
                                    button 
                                    onClick={() => handleNotificationClick(notification)} 
                                    style={{ 
                                        ...styles.listItem, 
                                        ...(index < nofunseen && styles.listItemHighlight) 
                                    }}
                                >
                                    <ListItemText 
                                        primary={
                                            <div>
                                                <Typography style={styles.dateText}>
                                                    {formatDate(notification.date)}
                                                </Typography>
                                                <Typography style={{
                                                    ...styles.listItemText,
                                                    ...(index < nofunseen ? styles.previewTextBlack : styles.previewTextGray),
                                                }}>
                                                    {createPreview(notification.message)}
                                                </Typography>
                                            </div>
                                        }
                                        style={index < nofunseen ? styles.previewTextBlack : styles.previewTextGray}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography variant="h2" sx={{ marginTop: 4, marginBottom: 2 }}>School Calendar</Typography>
          <Typography variant="body1">You can see school calendar here:</Typography>
          <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCalendar} 
          sx={{ marginTop: 2 }}
        >
          See School Calendar
        </Button>
        </TabPanel>
      </div>
    </div>
  );
  
};

export default StudentDashboard;