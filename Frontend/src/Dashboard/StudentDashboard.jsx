import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import { useStudent } from '../context/StudentContext';
import { CgProfile } from "react-icons/cg";
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

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, logoutStudent } = useStudent();
  const [name, setName] = useState(student ? student.first_name : '');
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

  useEffect(() => {
    if (token) {
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

  const renderTabs = () => (
    <Tabs value={value} onChange={handleChange} className='stu-dashboard-nav'>
      <Tab label={<CgProfile size={22} />} onClick={handleProfile}></Tab>
      <Tab label="Home" />
      <Tab label="Classes" />
      <Tab label="Consultation Tests" />
      <Tab label="Log Out" onClick={handleLogout}></Tab>
    </Tabs>
  );

  const renderMenu = () => (
    <Menu right>
      <a onClick={handleProfile} className="menu-item">Profile</a>
      <a onClick={() => setValue(1)} className="menu-item">Home</a>
      <a onClick={() => setValue(2)} className="menu-item">Classes</a>
      <a onClick={() => setValue(3)} className="menu-item">Consultation Tests</a>
      <a onClick={handleLogout} className="menu-item">Log Out</a>
    </Menu>
  );

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
      </div>
    </div>
  );
  
};

export default StudentDashboard;