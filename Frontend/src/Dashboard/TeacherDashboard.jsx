// Dashboard/TeacherDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../context/TeacherContext';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();
  const [name, setName] = useState(teacher ? teacher.first_name : '');
  const [lastName, setLastName] = useState(teacher ? teacher.last_name : '');

  const token = teacher?.jwt;

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/teacher/user', {
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

  const handleLogout = () => {
    logoutTeacher();
    navigate('/teacher-login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome, {name} {lastName}!</h1>
      <p>This is your teacher dashboard. You can view your information here.</p>
      
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default TeacherDashboard;
