import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user ? user.first_name : '');
  const token = user?.jwt; 
  console.log(token)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch('http://127.0.0.1:8000/api/user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setName(userData.first_name);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    onLogout();
    navigate('/principal-login');
  };

  return (
    <div>
      <h1>Welcome, {name || 'Principal'}!</h1>
      <p>This is your dashboard.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
