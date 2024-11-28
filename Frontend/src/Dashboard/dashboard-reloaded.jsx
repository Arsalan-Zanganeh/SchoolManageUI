import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Box, Container, Grid, Paper, Typography, CssBaseline, Button, Avatar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ExitToApp, Menu, Class,Person ,PersonAdd, School,Person4, HomeWork , NotificationAdd , PermContactCalendar , Security } from '@mui/icons-material';
import { styled } from '@mui/system';
import './App.css';
import { useMediaQuery } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // blue
    },
    text: {
      secondary: '#757575', // black
    },
    background: {
      default: '#f4f6f8', // white
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
  height: '200px', // Make the boxes square-shaped
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

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState({
    name: "Helli 7",
    location: "blah blah blah",
  });
  const isDesktop = useMediaQuery('(min-width:600px)'); // Change the breakpoint as needed
  const isMobile = useMediaQuery('(max-width:599px)'); // Define a media query for mobile screens

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSchoolSelection = (school) => {
    setSelectedSchool(school);
  };

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const data = [1, 2, 3, 4, 5]; // Example data
      setOptions(data);
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main, zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Avatar alt="Profile Picture" src="/src/1.jpg" sx={{ marginRight: 2 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dr. Ghader
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="logout">
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Container maxWidth="lg" >
              <SchoolInfoBox elevation={3}>
                <HomeWork fontSize="large" />
                <Box>
                  <Typography variant="h6">{selectedSchool.name}</Typography>
                  <Typography variant="body1">Location: {selectedSchool.location}</Typography>
                  <Typography variant="body2">Additional information about the school can go here.</Typography>
                </Box>
              </SchoolInfoBox>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Classes Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page1" onClick={() => handleSchoolSelection({ name: "Helli 7", location: "blah blah blah" })}>
                    <Class fontSize="large" />
                    <Typography variant="subtitle1">Manage Classes</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page2" onClick={() => handleSchoolSelection({ name: "School 2", location: "Location 2" })}>
                    <PersonAdd fontSize="large" />
                    <Typography variant="subtitle1">Sign up Teachers</Typography>
                  </NavigationBox>
                </Grid>
                <Grid item xs={6} sm={4} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <NavigationBox elevation={3} component="a" href="https://example.com/page3" onClick={() => handleSchoolSelection({ name: "School 3", location: "Location 3" })}>
                    <School fontSize="large" />
                    <Typography variant="subtitle1">Sign up Students</Typography>
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
                <ListItem button component="a" href="https://example.com/page1">
                  <ListItemText primary="Switch School" />
                </ListItem>
                <ListItem button component="a" href="https://example.com/page2">
                  <ListItemText primary="Link to Page 2" />
                </ListItem>
                <ListItem button component="a" href="https://example.com/page3">
                  <ListItemText primary="Link to Page 3" />
                </ListItem>
              </List>
            </Drawer>
          ) : (
            <Drawer anchor="right" open={sidebarOpen} onClose={toggleSidebar} sx={{ '& .MuiDrawer-paper': { bgcolor: theme.palette.primary.main, color: theme.palette.text.primary, '& .MuiListItemText-primary': { color: '#fff' } } }}>
              <Toolbar />
              <List>
                <ListItem button component="a" href="https://example.com/page1">
                  <ListItemText primary="Switch School" />
                </ListItem>
                <ListItem button component="a" href="https://example.com/page2">
                  <ListItemText primary="Link to Page 2" />
                </ListItem>
                <ListItem button component="a" href="https://example.com/page3">
                  <ListItemText primary="Link to Page 3" />
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

export default App;
