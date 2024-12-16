import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Badge,IconButton, Box, Container, Grid, Paper, Typography,Dialog, DialogActions,ListItemIcon ,DialogContent, DialogTitle , CssBaseline, Button, Avatar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ExitToApp, Menu, Class, Person, PersonAdd, School, Person4, HomeWork, NotificationAdd, PermContactCalendar, Security } from '@mui/icons-material';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import { styled } from '@mui/system';
import Swal from "sweetalert2";
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../context/TeacherContext';
import { CgProfile } from "react-icons/cg";
import './show-classes/teacher'
import TeacherClassList from './show-classes/teacher';
import AppWrapper from './ProfileTeacher';

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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [tabvalue, settabvalue] = useState(0);
  const { teacher, logoutTeacher } = useTeacher();
  const [name, setName] = useState(teacher ? teacher.first_name : '');
  const [lastName, setLastName] = useState(teacher ? teacher.last_name : '');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const token = teacher?.jwt;
  const [nofunseen, setcount] = useState(0);
  const isDesktop = useMediaQuery('(min-width:600px)');
  const drawerProps = isDesktop ? { variant: 'permanent', open: true } : { open: sidebarOpen, onClose: toggleSidebar };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/teacher/user', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const teacherData = await response.json();
        setName(teacherData.first_name);
        setLastName(teacherData.last_name);
      } else {
        console.error('Failed to fetch teacher data');
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  }, [token]);

  const handleLogout = () => {
  logoutTeacher();
  navigate('/');
  };

  useEffect(() => {
    if (token) {
      fetchTeacherData();
    }
  }, [token, fetchTeacherData]);

  const editProfile = () => settabvalue(3)
  const viewClasses = () => settabvalue(4);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main, zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
          <Avatar
                alt="Profile Picture"
                src="/src/1.jpg"
                sx={{
                  marginRight: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3, 
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                onClick={() => settabvalue(3)}
            />

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {`${name} ${lastName}`}
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="notifications"> 
              <Badge badgeContent={nofunseen} color="error"> 
                <NotificationsIcon /> 
                </Badge> 
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Box component="main" sx={{ flexGrow: 1, mt : 4 }}>
            <Container maxWidth="lg">
              <TabPanel value={tabvalue} index={0}>
              <Typography variant="h6" sx={{ mt:1, flexGrow: 1 , mb:3 }}>
              <Typography variant="body1">Welcome, {name} {lastName}!</Typography>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a">
                    <FavoriteIcon fontSize="large" />
                    <Typography variant="subtitle1">Favorite Tab</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={editProfile}>
                    <EditIcon fontSize="large" />
                    <Typography variant="subtitle1">Edit Profile</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={handleLogout}>
                    <ExitToApp fontSize="large" />
                    <Typography variant="subtitle1">Log out</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
              </TabPanel>

              <TabPanel value={tabvalue} index={1}>
              <Typography variant="h6" sx={{ mt:1, flexGrow: 1  , mb : 3}}>
                Your School
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" onClick={viewClasses}>
                    <Class fontSize="large" />
                    <Typography variant="subtitle1">Enter Classes</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3}>
                    <PermContactCalendar fontSize="large" />
                    <Typography variant="subtitle1">School Calendar</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
              </TabPanel>

            <TabPanel value={tabvalue} index={2}>
              <Typography variant="h6" sx={{ mt:1, flexGrow: 1 , mb: 3}}>
                Test & Planning
              </Typography>
            </TabPanel>
            <TabPanel value={tabvalue} index={3}>
              <AppWrapper goBack={() => settabvalue(0)}/>
            </TabPanel>
            <TabPanel value={tabvalue} index={4}>
              <TeacherClassList goBack={() => settabvalue(1) }/>
            </TabPanel>
            </Container>
          </Box>
          <Drawer anchor='left' {...drawerProps} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.drawer, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
              <Toolbar />
            <List>
              <ListItem button onClick={() => settabvalue(0)}
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
              <ListItem button onClick={() => settabvalue(1)}
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
                <ListItemText primary="School" />
              </ListItem>
              <ListItem button onClick={handleLogout}
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
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
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
    </ThemeProvider>
  );
};

export default TeacherDashboard;
