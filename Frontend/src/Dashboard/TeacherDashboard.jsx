import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import { slide as Menu } from 'react-burger-menu';
import { useTeacher } from '../context/TeacherContext';
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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();
  const [name, setName] = useState(teacher ? teacher.first_name : '');
  const [lastName, setLastName] = useState(teacher ? teacher.last_name : '');
  const token = teacher?.jwt;
  const [value, setValue] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  useEffect(() => {
    if (token) {
      fetchTeacherData();
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [token, fetchTeacherData]);

  const handleLogout = () => {
    logoutTeacher();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/dashboard/profile-teacher');
  };

  const showClasses = () => {
    navigate('./teacher-classes');
  };

  const renderTabs = () => (
    <Tabs value={value} onChange={handleChange} className="stu-dashboard-nav">
      <Tab label={<CgProfile size={22} />} onClick={handleProfile}></Tab>
      <Tab label="Home" />
      <Tab label="Classes" />
      <Tab label="Log Out" onClick={handleLogout}></Tab>
    </Tabs>
  );

  const renderMenu = () => (
    <Menu right>
      <a onClick={handleProfile} className="menu-item">Profile</a>
      <a onClick={() => setValue(1)} className="menu-item">Home</a>
      <a onClick={() => setValue(2)} className="menu-item">Classes</a>
      <a onClick={handleLogout} className="menu-item">Log Out</a>
    </Menu>
  );

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', backgroundColor: '#ffffff' }} className="stu-dashboard">
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
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#1566ff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Class List
          </button>
        </TabPanel>
      </div>
    </div>
  );
};

export default TeacherDashboard;
