// contexts/StudentContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    try {
      const savedStudent = localStorage.getItem("student");
      if (savedStudent) {
        const studentData = JSON.parse(savedStudent);
        if (studentData.jwt) {
          const decoded = decodeJwt(studentData.jwt);
          return {
            National_ID: decoded.National_ID,
            jwt: studentData.jwt
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading student data:', error);
      return null;
    }
  });

  const loginStudent = (data) => {
    console.log('LoginStudent called with:', data);
    if (data?.jwt) {
      const decoded = decodeJwt(data.jwt);
      if (decoded?.National_ID) {
        const studentData = {
          National_ID: decoded.National_ID,
          jwt: data.jwt
        };
        console.log('Saving student data:', studentData);
        setStudent(studentData);
        localStorage.setItem("student", JSON.stringify(studentData));
      } else {
        console.error('No National_ID in JWT payload');
      }
    } else {
      console.error('No JWT in login data');
    }
  };

  const logoutStudent = () => {
    setStudent(null);
    localStorage.removeItem("student");
  };

  // Debug log
  useEffect(() => {
    console.log('Student context updated:', student);
  }, [student]);

  return (
    <StudentContext.Provider value={{ 
      student, 
      loginStudent, 
      logoutStudent 
    }}>
      {children}
    </StudentContext.Provider>
  );
};

