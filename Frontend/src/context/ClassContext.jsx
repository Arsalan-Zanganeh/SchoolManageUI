import React, { createContext, useContext, useState } from 'react';

const ClassContext = createContext();

export const useClass = () => useContext(ClassContext);

export const ClassProvider = ({ children }) => {
  const [classToken, setClassToken] = useState(() => {
    const savedToken = localStorage.getItem("classToken");
    return savedToken || null; 
  });

  const loginClass = (token) => {
    setClassToken(token);
    localStorage.setItem("classToken", token); 
  };

  const logoutClass = () => {
    setClassToken(null);
    localStorage.removeItem("classToken"); 
  };

  return (
    <ClassContext.Provider value={{ classToken, loginClass, logoutClass }}>
      {children}
    </ClassContext.Provider>
  );
};
