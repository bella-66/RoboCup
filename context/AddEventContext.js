import React, { createContext, useContext, useState } from "react";

export const AddEventContext = createContext();

export const AddEventProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
    <AddEventContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </AddEventContext.Provider>
  );
};

export default function useAddEvent() {
  return useContext(AddEventContext);
}
