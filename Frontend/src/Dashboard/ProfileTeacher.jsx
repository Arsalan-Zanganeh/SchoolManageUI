import React, { useState, useEffect } from 'react';
import { useTeacher } from '../context/TeacherContext';
import defaultProfileImage from './screenshot (529).png';
import { useNavigate } from 'react-router-dom';
import './profile1.css';

const ShowProfile = () => {
  const { teacher } = useTeacher();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/dashboard/edit-teacher');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/teacher/profile/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${teacher?.jwt}`,
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

    if (teacher?.jwt) {
      fetchProfile();
    }
  }, [teacher]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!profile) {
    return <p>No teacher profile data available</p>;
  }

  return (
    <div className="profile-container">
      <h1>Teacher Profile Information</h1>
      <img 
        src={profile.TeacherProfile[0]?.profile_image || defaultProfileImage}
        alt="Teacher Profile"
        className="profile-image"
      />
      <div className="fields-container">
        <div className="field">
          <label>First Name:</label>
          <p>{profile.first_name || 'Not provided'}</p>
        </div>
        <div className="field">
          <label>Last Name:</label>
          <p>{profile.last_name || 'Not provided'}</p>
        </div>
        <div className="field full-width">
          <label>Address:</label>
          <p>{profile.Address || 'Not provided'}</p>
        </div>
        <div className="field full-width">
          <label>Bio:</label>
          <p>{profile.TeacherProfile[0]?.bio || 'Not provided'}</p>
        </div>
      </div>
      <div className="profile-buttons">
        <button onClick={handleEdit} className="edit-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ShowProfile;