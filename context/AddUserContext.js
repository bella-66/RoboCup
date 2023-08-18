import React, { createContext, useContext, useState } from "react";

export const AddUserContext = createContext();

export const AddUserProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
    <AddUserContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </AddUserContext.Provider>
  );
};

export default function useAddUser() {
  return useContext(AddUserContext);
}
