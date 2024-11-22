import './EditProfileStudent.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        LandLine: '',
        Address: '',
        Grade_Level: '',
        bio: '',
        profile_image: null
    });
    const [passwordData, setPasswordData] = useState({
        Old_Password: '',
        New_Password: ''
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/student/profile/', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    LandLine: data.LandLine,
                    Address: data.Address,
                    Grade_Level: data.Grade_Level,
                    bio: data.StudentProfile[0]?.bio || '',
                    profile_image: data.StudentProfile[0]?.profile_image
                });
                if (data.StudentProfile[0]?.profile_image) {
                    setImagePreview(data.StudentProfile[0].profile_image);
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

            const response = await fetch('http://127.0.0.1:8000/api/student/profile_edit/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire('Success', 'Profile updated successfully', 'success');
                navigate('/dashboard/profile-student');
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
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="LandLine">Landline : </label>
                    <input
                        type="tel"
                        id="LandLine"
                        name="LandLine"
                        value={profile.LandLine}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Address">Address : </label>
                    <textarea
                        id="Address"
                        name="Address"
                        value={profile.Address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Grade_Level">Grade Level : </label>
                    <input
                        type="text"
                        id="Grade_Level"
                        name="Grade_Level"
                        value={profile.Grade_Level}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio : </label>
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
                    <label htmlFor="profile_image">Profile Image : </label>
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