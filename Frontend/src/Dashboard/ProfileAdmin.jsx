import React, { useState, useEffect } from 'react';
import { usePrincipal } from '../context/PrincipalContext';
import { useNavigate } from 'react-router-dom';
import './profile1.css';

const ShowProfile = () => {
  const { principal } = usePrincipal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
      navigate('/dashboard/edit-admin');
  };

  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${principal?.jwt}`,
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

      if (principal?.jwt) {
          fetchProfile();
      }
  }, [principal]);

  if (loading) {
      return <p>Loading...</p>;
  }

  if (error) {
      return <p>Error: {error}</p>;
  }

  return (
      <div className="profile-container">
          <h1>Profile Information</h1>
          {profile ? (
              <div>
                  {profile.UserProfile && profile.UserProfile[0]?.profile_image && (
                      <img 
                          src={profile.UserProfile[0].profile_image} 
                          alt="Profile" 
                          className="profile-image"
                      />
                  )}
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
                          <label>Phone Number:</label>
                          <p>{profile.Phone_Number || 'Not provided'}</p>
                      </div>
                      {profile.UserProfile && profile.UserProfile[0]?.bio !== undefined && (
                          <div className="field full-width">
                              <label>Bio:</label>
                              <p>{profile.UserProfile[0].bio || 'No bio provided'}</p>
                          </div>
                      )}
                  </div>
              </div>
          ) : (
              <p>No profile data available</p>
          )}
          <div className="profile-buttons">
              <button onClick={handleEdit} className="edit-button">
                  Edit Profile
              </button>
          </div>
      </div>
  );
};

export default ShowProfile;