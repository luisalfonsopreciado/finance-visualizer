import {
  UPDATE_PRICE,
  UPDATE_INTEREST,
  UPDATE_VOLATILITY,
} from "../actions/stockData";

const initialState = {
  currentPrice: "1300",
  volatility: "0.2",
  interest: "0.05",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRICE:
      return { ...state, currentPrice: action.price };
    case UPDATE_VOLATILITY:
      return { ...state, volatility: action.volatility };
    case UPDATE_INTEREST:
      return { ...state, interest: action.interest };
    default:
      // Will be run initially
      return state;
  }
};
