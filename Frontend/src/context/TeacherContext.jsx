// contexts/TeacherContext.js
import React, { createContext, useContext, useState } from 'react';

const TeacherContext = createContext();

export const useTeacher = () => {
  return useContext(TeacherContext);
};

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);

  const loginTeacher = (data) => {
    setTeacher(data);
  };

  const logoutTeacher = () => {
    setTeacher(null);
  };

  return (
    <TeacherContext.Provider value={{ teacher, loginTeacher, logoutTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};
