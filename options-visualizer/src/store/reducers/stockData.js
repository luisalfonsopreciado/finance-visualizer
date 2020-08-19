import {
  UPDATE_PRICE,
  UPDATE_INTEREST,
  UPDATE_VOLATILITY,
  UPDATE_TICKER,
  RESET_DATA,
} from "../actions/stockData";
import { stockDataInitialState } from "../../utility/constants";

export const initialState = { ...stockDataInitialState };

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRICE:
      return { ...state, currentPrice: action.price };
    case UPDATE_VOLATILITY:
      return { ...state, volatility: action.volatility };
    case UPDATE_INTEREST:
      return { ...state, interest: action.interest };
    case UPDATE_TICKER:
      return { ...state, ticker: action.ticker };
    case RESET_DATA:
      return { ...stockDataInitialState };
    default:
      // Will be run initially
      return state;
  }
};
