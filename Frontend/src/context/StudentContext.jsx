import React, { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const savedStudent = localStorage.getItem("student");
    return savedStudent ? JSON.parse(savedStudent) : null;
  });

  const loginStudent = (studentData) => {
    setStudent(studentData);
    localStorage.setItem("student", JSON.stringify(studentData));
  };

  const logoutStudent = () => {
    setStudent(null);
    localStorage.removeItem("student"); 
  };

  return (
    <StudentContext.Provider value={{ student, loginStudent, logoutStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
