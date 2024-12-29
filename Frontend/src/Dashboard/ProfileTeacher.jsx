import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Swal from 'sweetalert2';

const ProfilePage = ({ onBack }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    Email: '',
    Address: '',
    bio: '',
    profile_image: null,
    Old_Password: '',
    New_Password: '',
  });
  

  const [imagePreview, setImagePreview] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher/profile/`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Data:', data);  // Log fetched data
  
        const teacherProfile = data.TeacherProfile?.[0] || {};
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          Email: data.Email || '',
          Address: data.Address || '', // Update to use data.Address directly
          bio: teacherProfile.bio || '',
          profile_image: teacherProfile.profile_image || null,
          Old_Password: '',
          New_Password: '',
        });
  
        if (teacherProfile.profile_image) {
          setImagePreview(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${teacherProfile.profile_image}`);
        }
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  
  useEffect(() => {
    fetchProfileData();
  }, []);
   // Empty dependency array means this runs only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profile_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Append form data - If address is empty, it will be sent as an empty string.
      formData.append('Address', profile.Address || ''); // Empty address allowed
      formData.append('Email', profile.Email);
      formData.append('bio', profile.bio);
      formData.append('Old_Password', profile.Old_Password);
      formData.append('New_Password', profile.New_Password);

      if (profile.profile_image instanceof File) {
        formData.append('profile_image', profile.profile_image);
      }

      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/teacher/profile_edit/`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: 'Profile updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save changes', 'error');
    }
  };

  return (
        <Container
        sx={{
          // position: { xs: "relative", sm: "absolute" },
          left: { xs: "10px", sm: "190px" },
          right: { xs: "10px", sm: "40px" },
          // width: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
          maxWidth: { xs: "100%", sm: "1400px" },
          height: { xs: "auto", sm: "auto" },
          margin: "0 auto",
          paddingup: "20px",
          // backgroundColor: "#fff",
          // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          boxShadow={3}
          borderRadius={2}
          overflow="hidden"
          bgcolor="white"
        >
          {/* Sidebar */}
          <Box bgcolor="#1e3a8a" p={4} display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={imagePreview || '/default-avatar.png'}
              sx={{ width: 180, height: 180, mb: 2 }}
            />
            {isEditMode && (
              <label htmlFor="upload-photo">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-photo"
                  type="file"
                  onChange={handleImageChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    backgroundColor: '#1976D2',
                    '&:hover': { backgroundColor: '#1565C0' },
                    color: 'white',
                  }}
                >
                  Upload Photo
                </Button>
              </label>
            )}
          </Box>

          {/* Main Content */}
          <Box p={4} bgcolor="#f4f6ff" flex={1}>
            <Typography variant="h5" gutterBottom textAlign="center">
              {isEditMode ? 'Edit Profile' : 'Profile Details'}
            </Typography>
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={profile.first_name}
                  fullWidth
                  InputProps={{ readOnly: !isEditMode }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  fullWidth
                  InputProps={{ readOnly: !isEditMode }}
                  onChange={handleChange}
                />
              </Grid>

              {/* Email Field - Always Read-Only */}
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="Email"
                  value={profile.Email}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: true }} // Email is always read-only
                />
              </Grid>

              {/* Editable Fields */}
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="Address"
                  value={profile.Address}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: !isEditMode }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ readOnly: !isEditMode }}
                />
              </Grid>

              {/* Password Fields - Only visible in edit mode */}
              {isEditMode && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Old Password"
                      type="password"
                      name="Old_Password"
                      value={profile.Old_Password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="New Password"
                      type="password"
                      name="New_Password"
                      value={profile.New_Password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
              {!isEditMode && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onBack}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
              )}
              {isEditMode ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
