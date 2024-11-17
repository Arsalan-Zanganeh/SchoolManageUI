import React, { createContext, useContext, useState } from 'react';

const SchoolContext = createContext();

export const useSchool = () => useContext(SchoolContext);

export const SchoolProvider = ({ children }) => {
  const [schoolToken, setSchoolToken] = useState(() => {
    const savedToken = localStorage.getItem("schoolToken");
    return savedToken || null; 
  });

  const loginSchool = (token) => {
    setSchoolToken(token);
    localStorage.setItem("schoolToken", token); 
  };

  const logoutSchool = () => {
    setSchoolToken(null);
    localStorage.removeItem("schoolToken"); 
  };

  return (
    <SchoolContext.Provider value={{ schoolToken, loginSchool, logoutSchool }}>
      {children}
    </SchoolContext.Provider>
  );
};
