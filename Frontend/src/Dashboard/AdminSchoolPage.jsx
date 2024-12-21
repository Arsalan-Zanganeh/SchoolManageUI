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
    primary: { main: '#0036AB' },
    text: { secondary: '#757575' },
    background: { default: '#f4f6f8' },
  },
});
const patterns = [
  // طرح 1: مورب ظریف با شفافیت
  'linear-gradient(135deg, rgba(144, 202, 249, 0.5) 10%, transparent 10%, transparent 20%, rgba(144, 202, 249, 0.5) 20%)',

  // طرح 2: موج ملایم (Soft Wave)
  'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.4), transparent 70%)',

  // طرح 3: ترکیب سایه‌های مورب
  'repeating-linear-gradient(135deg, rgba(144, 202, 249, 0.2), rgba(144, 202, 249, 0.4) 20px, transparent 20px, transparent 40px)',

  // طرح 4: خطوط نرم افقی
'repeating-linear-gradient(135deg, rgba(144, 202, 249, 0.3), rgba(144, 202, 249, 0.3) 10px, rgba(255, 255, 255, 0.8) 10px, rgba(255, 255, 255, 0.8) 20px)',

  // طرح 5: شطرنجی مدرن
  'repeating-linear-gradient(45deg, rgba(144, 202, 249, 0.3), rgba(144, 202, 249, 0.3) 10px, transparent 10px, transparent 20px)',

  // طرح 6: سایه‌های عمودی
  'linear-gradient(to bottom, rgba(144, 202, 249, 0.3), rgba(144, 202, 249, 0.7))'
];









const NavigationBox = styled(Paper)(({ theme, background }) => ({
  textAlign: 'center',
  color: '#fff',
  background: background, // استفاده از طرح دریافتی
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '300px',
  height: '220px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  margin: 'auto',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
  },
}));







const OverlayText = styled(Box)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  padding: '10px',
  textAlign: 'center',
  fontSize: '1rem',
});


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

    <ThemeProvider  theme={theme}>
          <div className="admin-page-background"></div>
      <CssBaseline />
      <Box
   sx={{
    top : 0 ,
    
    position: { xs: "relative", sm: "absolute" },
    left: { xs: "10px", sm: "20px" },
    right: { xs: "10px", sm: "20px" },
    // width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
    maxWidth: { xs: "100%", sm: "1400px" },
    height: { xs: "auto", sm: "auto" },
    margin: "0 auto",
    padding: "20px",
    // backgroundImage: `url('/school-default.jpg')`, // مسیر عکس
    // backgroundSize: "cover", // عکس کل صفحه را می‌پوشاند
    // backgroundRepeat: "no-repeat", // تکرار نشود
    // backgroundPosition: "center", // مرکز صفحه

    // backgroundColor: "#fff",
    // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    // borderRadius: "8px",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  }}
>

<AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
  <Toolbar>
    <Grid container alignItems="center">
      {/* ستون اول: عنوان */}
      <Grid item xs>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'left',
            fontSize: '1.2rem',
          }}
        >
          Admin Panel
        </Typography>
      </Grid>

      {/* ستون دوم: دکمه خروج */}
      <Grid item>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="logout"
          onClick={handleLogout}
          sx={{
            padding: '8px', // تنظیم فضای کلیک
          }}
        >
          <ExitToApp />
        </IconButton>
      </Grid>
    </Grid>
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
<Container 
  maxWidth={false} 
  sx={{ 
    textAlign: 'center',
    marginTop: { xs: 4, sm: 8 }, // Reduced top margin on mobile
    padding: '0 24px', 
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    justifyContent: 'space-between',
    gap: { xs: 4, sm: 6 } // Add gap between school grid and button
  }}
>
  {/* School content */}
  <Box>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        color: '#ffffff',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
        fontWeight: 'bold',
        marginBottom: { xs: 3, sm: 4 } // Adjusted bottom margin
      }}
    >
      Select School
    </Typography>

    <Grid container spacing={{ xs: 2, sm: 4 }} justifyContent="space-evenly" alignItems="center">
      {schools.map((school, index) => (
        <Grid item key={school.id} xs={12} sm={6} md={4} lg={3}>
          <NavigationBox
            style={{
              background: patterns[index % patterns.length],
              backgroundSize: '20px 20px',
              backgroundColor: '#fff',
            }}
            onClick={() => handleNavigateToDashboard(school.id, school.Postal_Code)}
          >
            <OverlayText>{school.School_Name}</OverlayText>
          </NavigationBox>
        </Grid>
      ))}
    </Grid>
  </Box>

  {/* Button at the bottom of the page */}
  <Box sx={{ 
    textAlign: 'center', 
    marginBottom: { xs: 2, sm: 4 },
    marginTop: { xs: 3, sm: 0 } // Add top margin on mobile to create space
  }}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={handleDialogOpen}
      sx={{ 
        fontWeight: 'bold', 
        fontSize: '1rem',
        width: 'fit-content',
        margin: '0 auto'
      }}
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
              sx={{ marginBottom: '8px' }} 

            />
            <Select
              margin="dense"
              fullWidth
              value={newSchool.School_Type}
              onChange={(e) => setNewSchool((prev) => ({ ...prev, School_Type: e.target.value }))}
              displayEmpty
              sx={{ marginBottom: '8px' }} 

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
    // </div>


  );
};

export default AdminSchoolPage;
