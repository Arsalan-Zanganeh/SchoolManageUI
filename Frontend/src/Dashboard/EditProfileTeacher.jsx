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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function EditProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        Address: '',
        bio: '',
        profile_image: null,
        Old_Password: '',
        New_Password: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/teacher/profile/', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    Address: data.Address,
                    bio: data.TeacherProfile[0]?.bio || '',
                    profile_image: null,
                    Old_Password: '',
                    New_Password: ''
                });
                if (data.TeacherProfile[0]?.profile_image) {
                    setImagePreview(data.TeacherProfile[0].profile_image);
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
            formData.append('Address', profile.Address);
            formData.append('bio', profile.bio);
            formData.append('Old_Password', profile.Old_Password);
            formData.append('New_Password', profile.New_Password);

            if (profile.profile_image) {
                formData.append('profile_image', profile.profile_image);
            }

            const response = await fetch('http://127.0.0.1:8000/api/teacher/profile_edit/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire('Success', 'Profile updated successfully', 'success');
                navigate('/dashboard/profile-teacher'); // Adjust this route as needed
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                } else {
                    const textError = await response.text();
                    throw new Error(`Server error: ${response.status} ${response.statusText}\n${textError}`);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error', `Failed to update profile: ${error.message}`, 'error');
        }
    };

    return (
        <Container sx={{ mt: 4, backgroundColor: '#9de2ff', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Edit Profile for Teacher
            </Typography>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address"
                            name="Address"
                            value={profile.Address}
                            onChange={handleChange}
                            required
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
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
                            value={profile.Old_Password}
                            onChange={handleChange}
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
                            value={profile.New_Password}
                            onChange={handleChange}
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

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>

                            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
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