export const UPDATE_DIRECTION = "UPDATE_DIRECTION";
export const UPDATE_AMOUNT = "UPDATE_AMOUNT";
export const UPDATE_KIND = "UPDATE_KIND";
export const UPDATE_STRIKE = "UPDATE_STRIKE";
export const UPDATE_EXPIRY = "UPDATE_EXPIRY";
export const ADD_CONTRACT = "ADD_CONTRACT";
export const REMOVE_CONTRACT = "REMOVE_CONTRACT";
export const RESET_PORTFOLIO = "RESET_PORTFOLIO";
export const SET_PORTFOLIO = "SET_PORTFOLIO";
export const UPDATE_PRICES = "UPDATE_PRICES";

export const updateDirection = (contractName, direction, stockData) => {
  return {
    type: UPDATE_DIRECTION,
    direction,
    contractName,
    stockData,
  };
};

export const updateAmount = (contractName, amount, stockData) => {
  return {
    type: UPDATE_AMOUNT,
    amount,
    contractName,
    stockData,
  };
};

export const updateKind = (contractName, kind, stockData) => {
  return {
    type: UPDATE_KIND,
    kind,
    contractName,
    stockData,
  };
};

export const updateStrike = (contractName, strike, stockData) => {
  return {
    type: UPDATE_STRIKE,
    strike,
    contractName,
    stockData,
  };
};

export const updateExpiry = (contractName, expiry, stockData) => {
  return {
    type: UPDATE_EXPIRY,
    expiry,
    contractName,
    stockData,
  };
};

export const addContract = (newContract, stockData) => {
  return {
    type: ADD_CONTRACT,
    newContract,
    stockData,
  };
};

export const removeContract = (contractId, stockData) => {
  return {
    type: REMOVE_CONTRACT,
    contractId,
    stockData,
  };
};

export const resetPortfolio = () => {
  return {
    type: RESET_PORTFOLIO,
  };
};

export const setPortfolio = (newPortfolio, stockData) => {
  return {
    type: SET_PORTFOLIO,
    newPortfolio,
    stockData,
  };
};

export const updatePrices = (stockData) => {
  return {
    type: UPDATE_PRICES,
    stockData,
  };
};

// Stock Data
export const UPDATE_PRICE = "UPDATE_PRICE";
export const UPDATE_VOLATILITY = "UPDATE_VOLATILITY";
export const UPDATE_INTEREST = "UPDATE_INTEREST";
export const UPDATE_TICKER = "UPDATE_TICKER";
export const RESET_DATA = "RESET_DATA"

export const updatePrice = (price) => {
  return {
    type: UPDATE_PRICE,
    price,
  };
};

export const updateTicker = (ticker) => {
  return {
    type: UPDATE_TICKER,
    ticker
  };
};

export const updateVolatility = (volatility) => {
  return {
    type: UPDATE_VOLATILITY,
    volatility,
  };
};

export const updateInterest = (interest) => {
  return {
    type: UPDATE_INTEREST,
    interest,
  };
};

export const resetData = () => {
  return {
    type: RESET_DATA
  }
}