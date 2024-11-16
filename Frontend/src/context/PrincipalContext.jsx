import React, { createContext, useContext, useState } from 'react';

const PrincipalContext = createContext();

export const usePrincipal = () => {
  return useContext(PrincipalContext);
};

export const PrincipalProvider = ({ children }) => {
  const [principal, setPrincipal] = useState(null);

  const loginPrincipal = (data) => {
    setPrincipal(data);
  };

  const logoutPrincipal = () => {
    setPrincipal(null);
  };

  return (
    <PrincipalContext.Provider value={{ principal, loginPrincipal, logoutPrincipal }}>
      {children}
    </PrincipalContext.Provider>
  );
};
