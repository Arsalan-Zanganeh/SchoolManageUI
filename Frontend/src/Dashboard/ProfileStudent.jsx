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
import { useStudent } from '../context/StudentContext'; 
import { useNavigate } from 'react-router-dom';

const ShowProfile = ({onBack}) => {
  const { student } = useStudent();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    Email: '',
    LandLine: '',
    Grade_Level: '',
    Address: '',
    bio: '',
    profile_image: null,
    Old_Password: '',
    New_Password: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student/profile/`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${student?.jwt}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            Email: data.Email || '',
            LandLine: data.LandLine || '',
            Grade_Level: data.Grade_Level || '',
            Address: data.Address || '',
            bio: data.StudentProfile[0]?.bio || '',
            profile_image: data.StudentProfile[0]?.profile_image || null,
            Old_Password: '',
            New_Password: '',
          });
          if (data.StudentProfile[0]?.profile_image) {
            setImagePreview(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api${data.StudentProfile[0]?.profile_image}`);
          }
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to load profile data', 'error');
      }
    };
    fetchProfileData();
  }, [student]);

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
      formData.append('LandLine', profile.LandLine);
      formData.append('Grade_Level', profile.Grade_Level);
      formData.append('Address', profile.Address);
      formData.append('Email', profile.Email);  // Ensure email is appended
      formData.append('bio', profile.bio);
      formData.append('Old_Password', profile.Old_Password);
      formData.append('New_Password', profile.New_Password);
  
      // Only append if it's a valid image file
      if (profile.profile_image instanceof File) {
        formData.append('profile_image', profile.profile_image);
      }
  
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/api/student/profile_edit/`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${student?.jwt}` },
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
        const error = await response.json();
        Swal.fire('Error', `Failed to update profile: ${error.detail || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Swal.fire('Error', 'Failed to save changes', 'error');
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleBackToDashboard = () => {
    onBack();
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
                  InputProps={{ readOnly: true }} // Make First Name readonly
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  fullWidth
                  InputProps={{ readOnly: true }} // Make Last Name readonly
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="Email"
                  value={profile.Email}
                  fullWidth
                  InputProps={{ readOnly: true }} // Always make Email read-only
                  onChange={handleChange}
                />
              </Grid>

              {/* Editable Fields */}
              <Grid item xs={12}>
                <TextField
                  label="Landline"
                  name="LandLine"
                  value={profile.LandLine}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: !isEditMode }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Grade Level"
                  name="Grade_Level"
                  value={profile.Grade_Level}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ readOnly: !isEditMode }}
                />
              </Grid>
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

              {/* Password Fields */}
              {isEditMode && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Old Password"
                      type={showOldPassword ? 'text' : 'password'}
                      name="Old_Password"
                      value={profile.Old_Password}
                      onChange={handleChange}
                      fullWidth
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
                </>
              )}
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
              {!isEditMode ? (
                <>
                  <Button variant="contained" color="secondary" onClick={handleBackToDashboard} sx={{ mr: 2 }}>
                    Back to Dashboard
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancelEdit} sx={{ ml: 2 }}>
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ShowProfile;
