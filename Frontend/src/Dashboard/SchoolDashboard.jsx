import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext'; 
import { usePrincipal } from '../context/PrincipalContext'; 

const SchoolDashboard = () => {
  const { schoolId } = useParams(); 
  const navigate = useNavigate();
  const { schoolToken } = useSchool(); 
  const { principal } = usePrincipal(); 
  const [school, setSchool] = useState(null); 
  const [principalInfo, setPrincipalInfo] = useState(null); 


  const fetchSchoolData = useCallback(async () => {
    if (!schoolToken) {
      console.log('No school token available');
      return;
    }
    try {
      console.log('Sending request to fetch school data...');
      const response = await fetch('http://127.0.0.1:8000/api/school/', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('School data fetched successfully:', data);
        const selectedSchool = data.find(school => school.id === parseInt(schoolId));
        setSchool(selectedSchool);
      } else {
        console.error('Failed to fetch school data');
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
    }
  }, [schoolId, schoolToken]);

  const fetchPrincipalData = useCallback(async () => {
    if (!principal?.jwt) {
      console.log('No principal JWT available');
      return; 
    }
    try {
      console.log('Sending request to fetch principal data...');
      const response = await fetch('http://127.0.0.1:8000/api/user/', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Principal data fetched successfully:', data);
        setPrincipalInfo(data);
      } else {
        console.error('Failed to fetch principal data');
      }
    } catch (error) {
      console.error('Error fetching principal data:', error);
    }
  }, [principal?.jwt]);

  useEffect(() => {
    console.log('Attempting to fetch school data...');
    fetchSchoolData();
    fetchPrincipalData();
  }, [schoolId, schoolToken, fetchSchoolData, fetchPrincipalData]);

  const addStudent = () => {
    navigate(`/dashboard/school/${schoolId}/add-student`);
  };

  const addTeacher = () => {
    navigate(`/dashboard/school/${schoolId}/add-teacher`);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {school ? (
        <>
          <h1>Welcome to {school.School_Name} Dashboard</h1>
          <p>{school.City}, {school.Province}</p>
          {principalInfo ? (
            <h2>Principal: {principalInfo.first_name} {principalInfo.last_name}</h2>
          ) : (
            <p>Loading principal data...</p>
          )}
          <button onClick={addStudent}>Add Student</button>
          <button onClick={addTeacher}>Add Teacher</button>
        </>
      ) : (
        <p>Loading school data...</p>
      )}
    </div>
  );
};

export default SchoolDashboard;
