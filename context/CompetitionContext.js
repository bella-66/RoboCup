import React, { createContext, useContext, useState } from "react";

export const CompetitionContext = createContext();

export const CompetitionProvider = ({ children }) => {
  const [isChangedComp, setIsChangedComp] = useState(false);

  return (
    <CompetitionContext.Provider value={{ isChangedComp, setIsChangedComp }}>
      {children}
    </CompetitionContext.Provider>
  );
};

export default function useCompetition() {
  return useContext(CompetitionContext);
}
