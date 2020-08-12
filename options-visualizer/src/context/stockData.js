import React from "react";

const StockContext = {
  currentPrice: "",
  volatility: "",
  interest: "",
};

export const stockContext = React.createContext(StockContext);
