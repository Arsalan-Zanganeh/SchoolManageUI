import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user ? user.first_name : '');
  const [lastName, setLastName] = useState(user ? user.last_name : '');
  const token = user?.jwt;

  const fetchUserData = useCallback(async () => {
    try {
      const userResponse = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          'Content-Type': 'application/json',
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
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token, fetchUserData]);


  const handleLogout = () => {
    onLogout();
    navigate('/principal-login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome, {name} {lastName}!</h1>
      <p>This is your dashboard. You can view and manage your account here.</p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
