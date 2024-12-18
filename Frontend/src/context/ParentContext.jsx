import React, { createContext, useContext, useState } from "react";

const ParentContext = createContext();

export const useParent = () => useContext(ParentContext);

export const ParentProvider = ({ children }) => {
  const [parent, setParent] = useState(() => {
    const savedParent = localStorage.getItem("parent");
    return savedParent ? JSON.parse(savedParent) : null;
  });

  const loginParent = (parentData) => {
    setParent(parentData);
    localStorage.setItem("parent", JSON.stringify(parentData));
  };

  const logoutParent = () => {
    setParent(null);
    localStorage.removeItem("parent");
  };

  return (
    <ParentContext.Provider value={{ parent, loginParent, logoutParent }}>
      {children}
    </ParentContext.Provider>
  );
};
