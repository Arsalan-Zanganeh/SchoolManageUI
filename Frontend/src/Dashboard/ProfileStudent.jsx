import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext'; 
import defaultProfileImage from './screenshot (529).png';
import { useNavigate } from 'react-router-dom';
import './profile.css'; 

const ShowProfile = () => {
  const { student } = useStudent();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/dashboard/edit-student');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/student/profile/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${student?.jwt}`,
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

    if (student?.jwt) {
      fetchProfile();
    }
  }, [student]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!profile) {
    return <p>No student profile data available</p>;
  }

  return (
    <div className="profile-container">
      <h1>Student Profile Information</h1>
      <img 
        src={profile.StudentProfile[0]?.profile_image || defaultProfileImage}
        alt="Student Profile"
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
        <div className="field">
          <label>Landline:</label>
          <p>{profile.LandLine || 'Not provided'}</p>
        </div>
        <div className="field">
          <label>Grade Level:</label>
          <p>{profile.Grade_Level || 'Not provided'}</p>
        </div>
        <div className="field full-width">
          <label>Address:</label>
          <p>{profile.Address || 'Not provided'}</p>
        </div>
        <div className="field full-width">
          <label>Bio:</label>
          <p>{profile.StudentProfile[0]?.bio || 'Not provided'}</p>
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