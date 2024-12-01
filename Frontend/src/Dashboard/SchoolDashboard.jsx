import React, { useState, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Box, Container, Grid, Paper, Typography, CssBaseline, Button, Avatar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ExitToApp, Menu, Class, Person, PersonAdd, School, Person4, HomeWork, NotificationAdd, PermContactCalendar, Security } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { usePrincipal } from '../context/PrincipalContext';
import './SchoolDashboard.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
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
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { schoolToken } = useSchool();
  const { principal } = usePrincipal();
  const [school, setSchool] = useState(null);
  const [principalInfo, setPrincipalInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSchoolData = useCallback(async () => {
    if (!schoolToken) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/school/', {
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

  const fetchPrincipalData = useCallback(async () => {
    if (!principal?.jwt) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/', {
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

  const addStudent = () => navigate(`/dashboard/school/${schoolId}/add-student`);
  const addTeacher = () => navigate(`/dashboard/school/${schoolId}/add-teacher`);
  const viewClasses = () => navigate(`/dashboard/school/${schoolId}/classes`);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isDesktop = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:599px)');

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
                onClick={() => navigate('/dashboard/profile-admin')}
            />

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {principalInfo ? `${principalInfo.first_name} ${principalInfo.last_name}` : 'Loading...'}
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="logout">
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="lg">
              {school && (
                <SchoolInfoBox elevation={3}>
                  <HomeWork fontSize="large" />
                  <Box>
                    <Typography variant="h6">{school.School_Name}</Typography>
                    <Typography variant="body1">{school.City}, {school.Province}</Typography>
                  </Box>
                </SchoolInfoBox>
              )}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
                  <NavigationBox elevation={3} component="a" href="https://example.com/page1" onClick={() => handleSchoolSelection({ name: "Helli 7", location: "blah blah blah" })}>
                    <NotificationAdd fontSize="large" />
                    <Typography variant="subtitle1">Send Notifications</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
            </Container>
            <Container maxWidth="lg">
              <Typography variant="h6" sx={{ mt:1, flexGrow: 1 }}>
                Office Automation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page1" onClick={() => handleSchoolSelection({ name: "Helli 7", location: "blah blah blah" })}>
                    <Person fontSize="large" />
                    <Typography variant="subtitle1">Student Files</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page2" onClick={() => handleSchoolSelection({ name: "School 2", location: "Location 2" })}>
                    <Person4 fontSize="large" />
                    <Typography variant="subtitle1">Teacher Files</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page3" onClick={() => handleSchoolSelection({ name: "School 3", location: "Location 3" })}>
                    <Security fontSize="large" />
                    <Typography variant="subtitle1">Disciplinary management</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page1" onClick={() => handleSchoolSelection({ name: "Helli 7", location: "blah blah blah" })}>
                    <PermContactCalendar fontSize="large" />
                    <Typography variant="subtitle1">Calendar</Typography>
                  </NavigationBox>
                </Grid>
              </Grid>
            </Container>
          </Box>
          {isDesktop ? (
            <Drawer variant="permanent" anchor="right" sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.main, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
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
                  <ListItemText primary="Switch School" />
                </ListItem>
              </List>
            </Drawer>
          ) : (
            <Drawer anchor="right" open={sidebarOpen} onClose={toggleSidebar} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.main, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
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
                  <ListItemText primary="Switch School" />
                </ListItem>
              </List>
            </Drawer>
          )}
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

export default SchoolDashboard;
