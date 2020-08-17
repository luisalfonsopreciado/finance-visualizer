import {
  UPDATE_PRICE,
  UPDATE_INTEREST,
  UPDATE_VOLATILITY,
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
    default:
      // Will be run initially
      return state;
  }
};
