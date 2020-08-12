export const UPDATE_PRICE = "UPDATE_PRICE";
export const UPDATE_VOLATILITY = "UPDATE_VOLATILITY";
export const UPDATE_INTEREST = "UPDATE_INTEREST";

export const updatePrice = (price) => {
  return {
    type: UPDATE_PRICE,
    price,
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
