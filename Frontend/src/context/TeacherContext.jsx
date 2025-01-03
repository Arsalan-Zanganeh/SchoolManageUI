// contexts/TeacherContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const TeacherContext = createContext();

export const useTeacher = () => useContext(TeacherContext);

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

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(() => {
    try {
      const savedTeacher = localStorage.getItem("teacher");
      if (savedTeacher) {
        const teacherData = JSON.parse(savedTeacher);
        if (teacherData.jwt) {
          const decoded = decodeJwt(teacherData.jwt);
          return {
            National_ID: decoded.National_ID,
            jwt: teacherData.jwt
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading teacher data:', error);
      return null;
    }
  });

  const loginTeacher = (data) => {
    console.log('LoginTeacher called with:', data);
    if (data?.jwt) {
      const decoded = decodeJwt(data.jwt);
      if (decoded?.National_ID) {
        const teacherData = {
          National_ID: decoded.National_ID,
          jwt: data.jwt
        };
        console.log('Saving teacher data:', teacherData);
        setTeacher(teacherData);
        localStorage.setItem("teacher", JSON.stringify(teacherData));
      } else {
        console.error('No National_ID in JWT payload');
      }
    } else {
      console.error('No JWT in login data');
    }
  };

  const logoutTeacher = () => {
    setTeacher(null);
    localStorage.removeItem("teacher");
  };

  // Debug log
  useEffect(() => {
    console.log('Teacher context updated:', teacher);
  }, [teacher]);

  return (
    <TeacherContext.Provider value={{ 
      teacher, 
      loginTeacher, 
      logoutTeacher 
    }}>
      {children}
    </TeacherContext.Provider>
  );
};

