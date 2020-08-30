export const ADD_CONTRACT = "ADD_CONTRACT";
export const REMOVE_CONTRACT = "REMOVE_CONTRACT";
export const RESET_PORTFOLIO = "RESET_PORTFOLIO";
export const SET_PORTFOLIO = "SET_PORTFOLIO";
export const UPDATE_PRICES = "UPDATE_PRICES";
export const UPDATE_CONTRACT = "UPDATE_CONTRACT";

export const addContract = (newContract) => {
  return {
    type: ADD_CONTRACT,
    newContract,
  };
};

export const updateContract = (contractName, property, value) => {
  return {
    type: UPDATE_CONTRACT,
    property,
    value,
    contractName,
  };
};

export const removeContract = (contractId) => {
  return {
    type: REMOVE_CONTRACT,
    contractId,
  };
};

export const resetPortfolio = () => {
  return {
    type: RESET_PORTFOLIO,
  };
};

export const setPortfolio = (newPortfolio) => {
  return {
    type: SET_PORTFOLIO,
    newPortfolio,
  };
};

export const updatePrices = () => {
  return {
    type: UPDATE_PRICES,
  };
};

// Stock Data
export const UPDATE_PRICE = "UPDATE_PRICE";
export const UPDATE_VOLATILITY = "UPDATE_VOLATILITY";
export const UPDATE_INTEREST = "UPDATE_INTEREST";
export const UPDATE_TICKER = "UPDATE_TICKER";
export const RESET_DATA = "RESET_DATA";
export const UPDATE_STOCK_DATA = "UPDATE_STOCK_DATA";

export const updateStockData = (property, value) => {
  return {
    type: UPDATE_STOCK_DATA,
    property,
    value,
  };
};

export const resetData = () => {
  return {
    type: RESET_DATA,
  };
};
