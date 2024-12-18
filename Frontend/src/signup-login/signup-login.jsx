import React, { useState } from 'react';
import { Container, Box, Typography, Button, Tabs, Tab, Paper, TextField, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { usePrincipal } from '../context/PrincipalContext';  
import { useStudent } from '../context/StudentContext'; 
import { useTeacher } from '../context/TeacherContext';
import {useParent} from '../context/ParentContext' ;
import './sl.css'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});


const HomePage = ({ onSignUpClick }) => (
  <Container maxWidth="sm" className="container-singuplogin">
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>Welcome to School Management System</Typography>
      <Button variant="contained" color="primary" onClick={onSignUpClick}>Sign Up / Login</Button>
    </Box>
  </Container>
);

const PrincipalSignUpForm = ({ onBackClick }) => {
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', National_ID: '', Phone_Number: '', password: '', password2: '', email: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordToggle = () => setShowPassword(!showPassword);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submit = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
            text: errorMessage || 'Registration failed. Please check the details and try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire('Error', 'An unknown error occurred. Please try again later.', 'error');
        }
      } else {
        Swal.fire('Success', 'Registration successful!', 'success');
        onBackClick()
      }

    } catch (error) {
      Swal.fire('Error', 'Server error or network issue. Please try again.', 'error');
      console.error('Error:', error);
    }
  };

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth label="Principal ID" name="National_ID" autoFocus value={formData.National_ID} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Name" name="first_name" value={formData.first_name} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Phone Number" name="Phone_Number" value={formData.Phone_Number} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange}/>
      <TextField margin="normal" required fullWidth label="Confirm Password" type={showPassword ? 'text' : 'password'} name="password2" autoComplete="current-password" value={formData.password2} onChange={handleChange}/>
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>Complete Sign Up</Button>
      <Button type="button" fullWidth variant="outlined" color="primary" sx={{ mt: 1 }} onClick={onBackClick}>Back</Button>
    </Box>
  );
};

const PrincipalForm = ({ onSignUpClick }) => {
  const navigate = useNavigate();

  const handleresetadmin = () => {
    navigate('/ResetPasswordAdmin'); // Use absolute path
  };

  const { loginPrincipal } = usePrincipal(); 
  const [formData, setFormData] = useState({ National_ID: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordToggle = () => setShowPassword(!showPassword);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        loginPrincipal(data); 
        navigate('/admin-school');  
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.detail || 'Invalid username or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Network error or server is unavailable. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth label="Principal ID" name="National_ID" autoFocus value={formData.National_ID} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange}/>
      <Button type="button" fullWidth variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }} onClick={onSignUpClick}>Sign Up</Button>
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>Login</Button>
      <Link onClick={handleresetadmin}  sx={{ display: 'block', textAlign: 'center', my: 1, backgroundColor: 'white' }}> Forgot Password? </Link>
    </Box>
  );
};

const StudentForm = () => {
  const navigate = useNavigate();
  const { loginStudent } = useStudent();
  const [formData, setFormData] = useState({ National_ID: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordToggle = () => setShowPassword(!showPassword);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleresetstudent = () => {
    navigate('/ResetPasswordStudent');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/student/login/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        loginStudent(data); 
        navigate('/student-dashboard'); 
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.detail || 'Invalid National_ID or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Network error or server is unavailable. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth label="Student ID" name="National_ID" autoFocus value={formData.National_ID} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange}/>
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>Login</Button>
      <Link onClick={handleresetstudent}  sx={{ display: 'block', textAlign: 'center', my: 1, backgroundColor: 'white' }}> Forgot Password? </Link>
    </Box>
  );
};
const TeacherForm = () => {
  const navigate = useNavigate();
  const { loginTeacher } = useTeacher();
  const [formData, setFormData] = useState({ National_ID: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordToggle = () => setShowPassword(!showPassword);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleresetteacher = () => {
    navigate('/ResetPasswordTeacher');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/teacher/login/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: 'Success',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        loginTeacher(data);
        navigate('/teacher-dashboard');
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error',
          text: errorData.detail || 'Invalid National_ID or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Network error or server is unavailable. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
      <TextField margin="normal" required fullWidth label="Teacher ID" name="National_ID" autoFocus value={formData.National_ID} onChange={handleChange} />
      <TextField margin="normal" required fullWidth label="Password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange}/>
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>Login</Button>
      <Link onClick={handleresetteacher}  sx={{ display: 'block', textAlign: 'center', my: 1, backgroundColor: 'white' }}> Forgot Password? </Link>
    </Box>
  );
};
const SignUpLogin = () => {
  const [view, setView] = useState('home');
  const [selectedTab, setSelectedTab] = useState(0);
  const [principalSignUp, setPrincipalSignUp] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPrincipalSignUp(false); // Reset principal sign-up state when switching tabs
  };

  const handlePrincipalSignUpClick = () => setPrincipalSignUp(true);
  const handleBackClick = () => setPrincipalSignUp(false);
  const renderForm = () => {
    if (selectedTab === 2 && principalSignUp) {
      return <PrincipalSignUpForm onBackClick={handleBackClick} />;
    }
  
    switch (selectedTab) {
      case 0:
        return <StudentForm />;
      case 1:
        return <ParentForm />;
      case 2:
        return <TeacherForm />;
      case 3:
        return <PrincipalForm onSignUpClick={handlePrincipalSignUpClick} />;
      default:
        return <StudentForm />;
    }
  };
  const ParentForm = () => {
    const navigate = useNavigate();
    const { loginParent } = useParent();
    const [formData, setFormData] = useState({ National_ID: '', Parent_password: '' });
  
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://127.0.0.1:8000/student/parent-login/", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            title: 'Success',
            text: 'Login successful!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          loginParent(data);
          navigate('/parent-dashboard');
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: 'Error',
            text: errorData.detail || 'Invalid National_ID or password. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Network error or server is unavailable. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };
  
    return (
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField margin="normal" required fullWidth label="Parent National ID" name="National_ID" autoFocus value={formData.National_ID} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Password" type="password" name="Parent_password" autoComplete="current-password" value={formData.Parent_password} onChange={handleChange} />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>Login</Button>
      </Box>
    );
  };
  
  

  return (
    <div className="body-singuplogin">
    <ThemeProvider theme={theme}>
      <div className='background-singuplogin'></div>
      {view === 'home' ? (
        <HomePage onSignUpClick={() => setView('signup')} />
      ) : (
        <Container maxWidth="sm" className="container-singuplogin">
          <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
              School Management System
            </Typography>
            <Box display="flex" justifyContent="center">
              <Tabs 
                value={selectedTab} 
                onChange={handleChange} 
                indicatorColor="primary" 
                textColor="primary" 
                variant="fullWidth">
                <Tab label="Student" />
                <Tab label="Parent" />
                <Tab label="Teacher" />
                <Tab label="Principal" />
              </Tabs>
            </Box>
            <Box mt={3}>
              {renderForm()}
            </Box>
          </Paper>
        </Container>
      )}
    </ThemeProvider>
  </div>
  );
};

export default SignUpLogin;