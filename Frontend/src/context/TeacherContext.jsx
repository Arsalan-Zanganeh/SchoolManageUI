// contexts/TeacherContext.js
import React, { createContext, useContext, useState } from 'react';

const TeacherContext = createContext();

export const useTeacher = () => useContext(TeacherContext);

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(() => {
    const savedTeacher = localStorage.getItem("teacher");
    return savedTeacher ? JSON.parse(savedTeacher) : null; 
  });

  const loginTeacher = (data) => {
    setTeacher(data);
    localStorage.setItem("teacher", JSON.stringify(data)); 
  };

  const logoutTeacher = () => {
    setTeacher(null);
    localStorage.removeItem("teacher");
  };

  return (
    <TeacherContext.Provider value={{ teacher, loginTeacher, logoutTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};
