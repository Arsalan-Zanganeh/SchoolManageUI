import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Container,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';


const ProfilePage = ({ onBack }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    Phone_Number: '',
    bio: '',
    profile_image: null,
    Old_Password: '',
    New_Password: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
          credentials: 'include',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            Phone_Number: data.Phone_Number || '',
            bio: data.UserProfile[0]?.bio || '',
            profile_image: data.UserProfile[0]?.profile_image || null,
            Old_Password: '',
            New_Password: '',
          });
          if (data.UserProfile[0]?.profile_image) {
            setImagePreview(`http://127.0.0.1:8000/api${data.UserProfile[0]?.profile_image}`);
          }
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to load profile data', 'error');
      }
    };
    fetchProfileData();
  }, []);

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
      formData.append('Phone_Number', profile.Phone_Number);
      formData.append('bio', profile.bio);
      formData.append('Old_Password', profile.Old_Password);
      formData.append('New_Password', profile.New_Password);
  
      if (profile.profile_image instanceof File) {
        formData.append('profile_image', profile.profile_image);
      }
  
      const response = await fetch('http://127.0.0.1:8000/api/user/profile_edit/', {
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
          // رفرش صفحه
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
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          boxShadow={3}
          borderRadius={2}
          overflow="hidden"
          width={{ xs: '100%', md: '70%' }}
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
                  InputProps={{ readOnly: true, style: { backgroundColor: '#f0f0f0' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  fullWidth
                  InputProps={{ readOnly: true, style: { backgroundColor: '#f0f0f0' } }}
                />
              </Grid>

              {/* Editable Fields */}
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="Phone_Number"
                  value={profile.Phone_Number}
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

              {/* Password Fields */}
              <Grid item xs={12}>
              <TextField
  label="Old Password"
  type={showOldPassword ? 'text' : 'password'}
  name="Old_Password"
  value={profile.Old_Password}
  onChange={handleChange}
  fullWidth
  inputProps={{
    'data-lpignore': 'true', // جلوگیری از عملکرد افزونه‌ها
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
          {showOldPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="New_Password"
                  value={profile.New_Password}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditMode,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
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
