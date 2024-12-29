import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrincipal } from '../context/PrincipalContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { principal, logoutPrincipal } = usePrincipal();
    const [name, setName] = useState(principal ? principal.first_name : '');
    const [lastName, setLastName] = useState(principal ? principal.last_name : '');
    const token = principal?.jwt;

    const fetchUserData = useCallback(async () => {
        try {
            const userResponse = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/user/`, {
                headers: {
                    'Content-Type': 'application/json',
                    // Uncomment and add Authorization header if needed
                    // Authorization: Bearer ${token},
                },
                credentials: 'include',
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setName(userData.first_name);
                setLastName(userData.last_name);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token, fetchUserData]);

    const handleProfile = () => {
        navigate('/dashboard/profile-admin');
    };

    const handleLogout = () => {
        logoutPrincipal();
        // Clear context state
        navigate('/principal-login');
    };

    const addStudent = () => {
        navigate('/dashboard/add-student');
    };

    const addTeacher = () => {
        navigate('/dashboard/add-teacher');
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '20px' }}>
          <button onClick={handleProfile} style={{ padding: '10px 10px', cursor: 'pointer', fontFamily: 'Arial',backgroundColor: '#ff8000', position: 'absolute', top: '50px', left: '50px' }}>
              Show Profile
          </button>
          <div style={{ marginLeft: 'auto', textAlign: 'center', marginTop: '20px' }}>
              <h1>Welcome, {name} {lastName}!</h1>
              <p>This is your dashboard. You can view and manage your account here.</p>
              <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
                  Logout
              </button>
              <div style={{ marginTop: '20px' }}>
                  <button onClick={addStudent} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer', marginRight: '10px' }}>
                      Add Student
                  </button>
                  <button onClick={addTeacher} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>
                      Add Teacher
                  </button>
              </div>
          </div>
      </div>
  );
  
};

export default Dashboard;
