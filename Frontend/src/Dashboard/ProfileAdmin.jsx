import React, { useState, useEffect } from 'react';
import { usePrincipal } from '../context/PrincipalContext';
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
  const { principal } = usePrincipal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
      navigate('/dashboard/edit-admin');
  };

  const handleDashboard = () => {
      navigate('/admin-school'); 
  };

  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${principal?.jwt}`,
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

      if (principal?.jwt) {
          fetchProfile();
      }
  }, [principal]);

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
              <Typography variant="h6">No principal profile data available</Typography>
          </Container>
      );
  }

  return (
      <Container sx={{ mt: 4, backgroundColor: '#9de2ff', padding: '20px', borderRadius: '16px' }}>
          <Grid container spacing={2}>
              {/* Profile Photo */}
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {profile.UserProfile && profile.UserProfile[0]?.profile_image && (
                      <Avatar 
                          src={`http://127.0.0.1:8000/api${profile.UserProfile[0].profile_image}`}
                          alt="Principal Profile"
                          sx={{ width: 160, height: 160 }} 
                      />
                  )}
              </Grid>
              <Grid item xs={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                          {profile.first_name || 'Not provided'} {profile.last_name || 'Not provided'}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, fontSize: '1.2rem', mb: 1 }}> 
                          <strong>Phone Number:</strong> {profile.Phone_Number || 'Not provided'}
                      </Typography>
                      {profile.UserProfile && profile.UserProfile[0]?.bio !== undefined && (
                          <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                              <strong>Bio:</strong> {profile.UserProfile[0].bio || 'No bio provided'}
                          </Typography>
                      )}

                      {/* Buttons */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button 
                              onClick={handleEdit} 
                              variant="contained" 
                              sx={{ backgroundColor: '#11566f', color: '#FFFFFF' }}
                              size="small"
                          >
                              Edit Profile
                          </Button>
                          <Button 
                              onClick={handleDashboard} 
                              variant="outlined" 
                              sx={{ borderColor: '#11566f', color: '#11566f' }} 
                              size="small"
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