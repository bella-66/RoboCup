import React, { createContext, useContext, useState } from "react";

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [timeline, setTimeline] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  return (
    <TimelineContext.Provider
      value={{ timeline, setTimeline, isChanged, setIsChanged }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

export default function useTimeline() {
  //   const context = useContext(TimelineContext);

  //   function postQuestionHandler(newTimeline) {
  //     // ...
  //     context.setTimeline((items) => [...items, newTimeline]);
  //   }

  //   return [context.timeline, postQuestionHandler];
  return useContext(TimelineContext);
}
