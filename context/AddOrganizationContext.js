import React, { createContext, useContext, useState } from "react";

export const AddOrganizationContext = createContext();

export const AddOrganizationProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
    <AddOrganizationContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </AddOrganizationContext.Provider>
  );
};

export default function useAddOrganization() {
  return useContext(AddOrganizationContext);
}
