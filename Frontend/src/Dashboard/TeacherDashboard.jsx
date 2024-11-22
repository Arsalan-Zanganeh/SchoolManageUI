// Dashboard/TeacherDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Tabs, Tab, Box, Typography  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../context/TeacherContext';
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();
  const [name, setName] = useState(teacher ? teacher.first_name : '');
  const [lastName, setLastName] = useState(teacher ? teacher.last_name : '');
  const token = teacher?.jwt;
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/teacher/user', {
        headers: {
          'Content-Type': 'application/json',
        //   Authorization: `Bearer ${token}`, // 
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

  useEffect(() => {
    if (token) {
      fetchTeacherData();
    }
  }, [token, fetchTeacherData]);

  const showclasses = () => {
    navigate('./teacher-classes');
  };

  const handleLogout = () => {
    logoutTeacher();
    navigate('/teacher-login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <div className="tab-container">
    <AppBar position="static">
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Home" />
        <Tab label="Profile" />
        <Tab label="Classes" />
      </Tabs>
    </AppBar>

    <TabPanel value={value} index={0}>
      <h2>Home</h2>
      <p>Welcome, {name} {lastName}!</p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
      Logout
    </button>
    </TabPanel>
    <TabPanel value={value} index={1}>
      <h2>Profile</h2>
      <p>Manage your profile here.</p>
    </TabPanel>
    <TabPanel value={value} index={2}>
      <h2>Classes</h2>
      <p>You can see your classes in here.</p>
      <button onClick={showclasses} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
      Class List
    </button>
    </TabPanel>
    </div>      
  </div>
  );
};

export default TeacherDashboard;
