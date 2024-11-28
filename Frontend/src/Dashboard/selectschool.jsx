import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Box, Container, Grid, Paper, Typography, CssBaseline, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ExitToApp, Add } from '@mui/icons-material';
import { styled } from '@mui/system';
import "./AdminSchoolPage.css"
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
  height: '200px', // Make the boxes square-shaped
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const selectschools = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');

  useEffect(() => {
    // Simulate fetching schools from an API
    const fetchSchools = async () => {
      const data = [
        { id: 1, name: 'School A', location: 'Location A' },
        { id: 2, name: 'School B', location: 'Location B' },
        { id: 3, name: 'School C', location: 'Location C' },
      ]; // Example data
      setSchools(data);
    };
    fetchSchools();
  }, []);

  const handleAddSchoolClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewSchoolName('');
    setNewSchoolLocation('');
  };

  const handleSaveSchool = () => {
    // Simulate posting new school data to an API
    const newSchool = { id: schools.length + 1, name: newSchoolName, location: newSchoolLocation };
    setSchools([...schools, newSchool]);
    handleDialogClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="background"></div>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
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
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom marginTop={5}>
              Select School
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {schools.map((school) => (
                <Grid item key={school.id}>
                  <NavigationBox elevation={3} onClick={() => setSelectedSchool(school)}>
                    {school.name}
                  </NavigationBox>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddSchoolClick}>
                Add School
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New School</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="School Name"
            type="text"
            fullWidth
            value={newSchoolName}
            onChange={(e) => setNewSchoolName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={newSchoolLocation}
            onChange={(e) => setNewSchoolLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Back
          </Button>
          <Button onClick={handleSaveSchool} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default selectschools;
