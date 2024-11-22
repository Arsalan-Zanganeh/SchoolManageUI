import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrincipal } from '../context/PrincipalContext';


const ShowProfile = () => {
  const { principal } = usePrincipal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${principal?.jwt}`, // Use token if needed
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
    <div>
      <h1>Profile Information</h1>
      {profile ? (
        <div>
          <p>First Name: {profile.first_name}</p>
          <p>Last Name: {profile.last_name}</p>
          <p>National_ID: {profile.National_ID}</p>
          {/* Add more profile fields as needed */}
        </div>
      ) : (
        <p>No profile data available</p>
      )}
    </div>
  );
};

export default ShowProfile;
