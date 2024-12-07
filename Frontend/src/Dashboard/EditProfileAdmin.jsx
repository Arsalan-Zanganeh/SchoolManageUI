import './EditProfileStudent.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function EditProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        Phone_Number: '',
        bio: '',
        profile_image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [passwordData, setPasswordData] = useState({
        Old_Password: '',
        New_Password: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    Phone_Number: data.Phone_Number,
                    bio: data.UserProfile[0]?.bio || '',
                    profile_image: null // Reset profile_image to null initially
                });
                if (data.UserProfile[0]?.profile_image) {
                    setImagePreview(data.UserProfile[0].profile_image);
                }
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Swal.fire('Error', 'Failed to load profile data', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prevProfile => ({
                ...prevProfile,
                profile_image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setProfile(prevProfile => ({
                ...prevProfile,
                profile_image: null
            }));
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('Phone_Number', profile.Phone_Number);
            formData.append('bio', profile.bio);

            if (profile.profile_image) {
                formData.append('profile_image', profile.profile_image);
            }

            formData.append('Old_Password', passwordData.Old_Password);
            formData.append('New_Password', passwordData.New_Password);

            const response = await fetch('http://127.0.0.1:8000/api/user/profile_edit/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire('Success', 'Profile updated successfully', 'success');
                navigate('/dashboard/profile-admin'); // Adjust this route as needed
            } else {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        }
    };

    return (
        <Container sx={{ mt: 4, backgroundColor: '#9de2ff', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Edit Profile for Admin
            </Typography>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone Number"
                            name="Phone_Number"
                            value={profile.Phone_Number}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>

                    {/* Old Password and New Password Fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Old Password"
                            type={showOldPassword ? "text" : "password"}
                            name="Old_Password"
                            value={passwordData.Old_Password}
                            onChange={handlePasswordChange}
                            variant="outlined"
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
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
                            name="New_Password"
                            value={passwordData.New_Password}
                            onChange={handlePasswordChange}
                            variant="outlined"
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

                    {/* Profile Image Upload */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                          <label htmlFor="profile_image">
                              <input 
                                  type="file" 
                                  id="profile_image" 
                                  name="profile_image" 
                                  onChange={handleImageChange} 
                                  accept="image/*" 
                                  style={{ display: 'none' }} 
                              />
                              <Button variant="contained" component="span">
                                  Upload Profile Image
                              </Button>
                          </label>
                          
                          {imagePreview && (
                              <Avatar 
                                  src={imagePreview} 
                                  alt="Profile Preview" 
                                  sx={{ width: 100, height: 100, mt: 2 }} 
                              />
                          )}
                        </Box>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                          <Button type="submit" variant="contained" color="primary">
                              Update Profile
                          </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default EditProfile;