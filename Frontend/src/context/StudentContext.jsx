// contexts/StudentContext.js
import React, { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export const useStudent = () => {
  return useContext(StudentContext);
};

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const loginStudent = (data) => {
    setStudent(data);
  };

  const logoutStudent = () => {
    setStudent(null);
  };

  return (
    <StudentContext.Provider value={{ student, loginStudent, logoutStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
