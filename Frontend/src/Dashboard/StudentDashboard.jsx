import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography  } from '@mui/material';
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
          <Typography>{children}</Typography>
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showclasses = () => {
    navigate('./student-classes');
  };
  const fetchStudentData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/student/user/', {
        headers: {
          'Content-Type': 'application/json',
        //   Authorization: `Bearer ${token}`,
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
  }, [token, fetchStudentData]);

  const handleLogout = () => {
    logoutStudent(); 
    navigate('/student-login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }} className='stu-dashboard'>
      <div className="tab-container">
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} className='stu-dashboard-nav'>
            <Tab label={<CgProfile size={22}/>}></Tab>
            <Tab label="Home"/>
            <Tab label="Classes"/>
            <Tab label="Log Out" onClick={handleLogout}></Tab>
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <h2>Profile</h2>
          <p>Manage your profile here.</p>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h2>Home</h2>
          <p>Welcome, {name} {lastName}!</p>
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

export default StudentDashboard;
