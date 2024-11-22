import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EditProfileStudent.css';

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
                    profile_image: data.TeacherProfile[0]?.profile_image,
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in profile) {
                formData.append(key, profile[key]);
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
                    <label htmlFor="Address">Address</label>
                    <textarea
                        id="Address"
                        name="Address"
                        value={profile.Address}
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
                    <label htmlFor="Old_Password">Old Password</label>
                    <input
                        type="password"
                        id="Old_Password"
                        name="Old_Password"
                        value={profile.Old_Password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="New_Password">New Password</label>
                    <input
                        type="password"
                        id="New_Password"
                        name="New_Password"
                        value={profile.New_Password}
                        onChange={handleChange}
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