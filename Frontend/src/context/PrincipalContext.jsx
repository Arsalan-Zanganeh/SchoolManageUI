import React, { createContext, useContext, useState } from 'react';

const PrincipalContext = createContext();

export const usePrincipal = () => useContext(PrincipalContext);

export const PrincipalProvider = ({ children }) => {
  const [principal, setPrincipal] = useState(() => {
    const savedPrincipal = localStorage.getItem("principal");
    return savedPrincipal ? JSON.parse(savedPrincipal) : null;
  });

  const loginPrincipal = (data) => {
    setPrincipal(data);
    localStorage.setItem("principal", JSON.stringify(data)); 
  };

  const logoutPrincipal = () => {
    setPrincipal(null);
    localStorage.removeItem("principal"); 
  };

  return (
    <PrincipalContext.Provider value={{ principal, loginPrincipal, logoutPrincipal }}>
      {children}
    </PrincipalContext.Provider>
  );
};
