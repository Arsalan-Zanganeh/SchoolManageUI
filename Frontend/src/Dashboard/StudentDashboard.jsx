import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, logoutStudent } = useStudent();
  const [name, setName] = useState(student ? student.first_name : '');
  const [lastName, setLastName] = useState(student ? student.last_name : '');

  const token = student?.jwt;

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
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome, {name} {lastName}!</h1>
      <p>This is your student dashboard. You can view your information here.</p>
      
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
