import React, { createContext, useContext, useState } from "react";

export const AddTeamContext = createContext();

export const AddTeamProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
    <AddTeamContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </AddTeamContext.Provider>
  );
};

export default function useAddTeam() {
  return useContext(AddTeamContext);
}
