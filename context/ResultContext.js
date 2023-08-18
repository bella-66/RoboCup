import React, { createContext, useContext, useState } from "react";

export const ResultContext = createContext();

export const ResultProvider = ({ children }) => {
  const [isChanged, setIsChanged] = useState(false);

  return (
    <ResultContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </ResultContext.Provider>
  );
};

export default function useResult() {
  return useContext(ResultContext);
}
