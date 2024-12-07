import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext'; 
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';

const ShowProfile = () => {
  const { student } = useStudent();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/dashboard/edit-student');
  };

  const handleDashboard = () => {
    navigate('/student-dashboard');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/student/profile/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${student?.jwt}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (student?.jwt) {
      fetchProfile();
    }
  }, [student]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h6">No student profile data available</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, backgroundColor: '#9de2ff', padding: '20px', borderRadius: '16px' }}>
      <Grid container spacing={2}>
        {/* Profile Photo */}
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar 
            src={`http://127.0.0.1:8000/api${profile.StudentProfile[0].profile_image}`}
            alt="Student Profile"
            sx={{ width: 160, height: 160, borderRadius: '10px' }} // Increased size and set border radius to 10px
          />
        </Grid>

        {/* Profile Information */}
        <Grid item xs={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}> {/* Added margin bottom */}
              {profile.first_name || 'Not provided'} {profile.last_name || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontSize: '1.2rem', mb: 1 }}> 
              <strong>Landline:</strong> {profile.LandLine || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
              <strong>Grade Level:</strong> {profile.Grade_Level || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
              <strong>Address:</strong> {profile.Address || 'Not provided'}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
              <strong>Bio:</strong> {profile.StudentProfile[0]?.bio || 'Not provided'}
            </Typography>

            {/* Buttons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}> {/* Reduced gap between buttons */}
              <Button 
                onClick={handleEdit} 
                variant="contained" 
                sx={{ backgroundColor: '#11566f', color: '#FFFFFF' }} // Custom color
                size="small" // Made button smaller
              >
                Edit Profile
              </Button>
              <Button 
                onClick={handleDashboard} 
                variant="outlined" 
                sx={{ borderColor: '#11566f', color: '#11566f' }} // Custom color for outlined button
                size="small" // Made button smaller
              >
                Dashboard
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const AppWrapper = () => (
  <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <ShowProfile />
  </div>
);

export default AppWrapper;