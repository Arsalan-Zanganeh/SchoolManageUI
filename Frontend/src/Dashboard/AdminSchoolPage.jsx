import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CssBaseline,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem, 
  Select
} from '@mui/material';
import { ExitToApp, Add } from '@mui/icons-material';
import { styled } from '@mui/system';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./AdminSchoolPage.css";
import { useSchool } from "../context/SchoolContext";
import { usePrincipal } from "../context/PrincipalContext";

const theme = createTheme({
  palette: {
    primary: { main: '#6200ea' },
    text: { secondary: '#757575' },
    background: { default: '#f4f6f8' },
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
  alignItems: 'center',
  justifyContent: 'center',
}));

const AdminSchoolPage = () => {
  const navigate = useNavigate();
  const { loginSchool, logoutSchool } = useSchool();
  const { logoutPrincipal } = usePrincipal();
  const [schools, setSchools] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [newSchool, setNewSchool] = useState({
    School_Name: "",
    Province: "",
    City: "",
    Address: "",
    School_Type: "",
    Education_Level: "",
    Postal_Code: "",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/school/", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setSchools(data);
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to load schools. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Network error or server is unavailable. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchSchools();
  }, []);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setErrorMessage(""); 
    setNewSchool({
      School_Name: "",
      Province: "",
      City: "",
      Address: "",
      School_Type: "",
      Education_Level: "",
      Postal_Code: "",
    });
  };

  const handleSaveSchool = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/add_school/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchool),
        credentials: "include",
      });

      if (response.ok) {
        const addedSchool = await response.json();
        setSchools((prev) => [...prev, addedSchool]);
        Swal.fire({
          title: "Success",
          text: "School added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        handleDialogClose();
      } else {
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        setErrorMessage(errorMessages || "Failed to add school. Please check your input.");
      }
    } catch (error) {
      setErrorMessage("Network error or server is unavailable. Please try again later.");
    }
  };

  const handleNavigateToDashboard = async (schoolId, Postal_Code) => {
    try {
      const loginResponse = await fetch(
        `http://127.0.0.1:8000/api/login_school/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Postal_Code }),
          credentials: "include",
        }
      );

      if (loginResponse.ok) {
        const token = await loginResponse.json();
        loginSchool(token);
        navigate(`/dashboard/school/${schoolId}`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to login to the school. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const adminLogoutResponse = await fetch(
        "http://127.0.0.1:8000/api/logout_school/",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!adminLogoutResponse.ok) {
        throw new Error("Failed to logout admin");
      }
      const schoolLogoutResponse = await fetch(
        "http://127.0.0.1:8000/api/logout/",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!schoolLogoutResponse.ok) {
        throw new Error("Failed to logout school");
      }
      logoutPrincipal();
      logoutSchool();
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <Avatar
              alt="Profile Picture"
              src="/src/1.jpg"
              sx={{ marginRight: 2, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/profile-admin')}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: 8 }}>
            <Typography variant="h4" gutterBottom>
              Select School
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {schools.map((school) => (
                <Grid item key={school.id}>
                  <NavigationBox
                    elevation={3}
                    onClick={() => handleNavigateToDashboard(school.id, school.Postal_Code)}
                  >
                    {school.School_Name}
                  </NavigationBox>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleDialogOpen}
              >
                Add New School
              </Button>
            </Box>
          </Container>
        </Box>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Add New School</DialogTitle>
          <DialogContent>
            {errorMessage && ( // نمایش پیام خطا در دیالوگ
              <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <TextField
              margin="dense"
              label="School Name"
              type="text"
              fullWidth
              value={newSchool.School_Name}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, School_Name: e.target.value }))}
            />
            <TextField
              margin="dense"
              label="Province"
              type="text"
              fullWidth
              value={newSchool.Province}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, Province: e.target.value }))}
            />
            <TextField
              margin="dense"
              label="City"
              type="text"
              fullWidth
              value={newSchool.City}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, City: e.target.value }))}
            />
            <TextField
              margin="dense"
              label="Address"
              type="text"
              fullWidth
              value={newSchool.Address}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, Address: e.target.value }))}
            />
            <Select
              margin="dense"
              fullWidth
              value={newSchool.School_Type}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, School_Type: e.target.value }))}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select School Type</em>
              </MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
            <Select
              margin="dense"
              fullWidth
              value={newSchool.Education_Level}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, Education_Level: e.target.value }))}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Education Level</em>
              </MenuItem>
              <MenuItem value="primary">Primary</MenuItem>
              <MenuItem value="middle">Middle</MenuItem>
              <MenuItem value="high school">High School</MenuItem>
            </Select>
            <TextField
              margin="dense"
              label="Postal Code"
              type="text"
              fullWidth
              value={newSchool.Postal_Code}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, Postal_Code: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveSchool} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminSchoolPage;
