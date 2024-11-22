import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EditProfileStudent.css';

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
                    profile_image: data.UserProfile[0]?.profile_image
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in profile) {
                formData.append(key, profile[key]);
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
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="Phone_Number">Phone Number</label>
                    <input
                        type="tel"
                        id="Phone_Number"
                        name="Phone_Number"
                        value={profile.Phone_Number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="oldPassword">Old Password : </label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="Old_Password"
                        value={passwordData.Old_Password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password : </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.New_Password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profile_image">Profile Image</label>
                    <input
                        type="file"
                        id="profile_image"
                        name="profile_image"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {imagePreview && (
                        <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                    )}
                </div>
                <button type="submit" class="update-button">Update Profile</button>
            </form>
        </div>
    );
}

export default EditProfile;