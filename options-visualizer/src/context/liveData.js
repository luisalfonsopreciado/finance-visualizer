import React from "react";

const defaultValue = {
  liveMode: false,
  setLiveMode: () => {},
};

export const liveDataContext = React.createContext(defaultValue);
