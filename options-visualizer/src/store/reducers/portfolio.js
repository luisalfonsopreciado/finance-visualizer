import * as cts from "../actions/portfolio";
import { initialPortfolio, getPrice } from "../../utility/constants";
import { stockDataInitialState } from "../../utility/constants";

export const initialState = {
  portfolio: { ...initialPortfolio },
  stockData: { ...stockDataInitialState },
};

const resetPortfolio = (state, action) => {
  return { portfolio: {}, stockData: { ...state.stockData } };
};

const removeContract = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  delete newPortfolio[action.contractId];
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
};

const addContract = (state, action) => {
  const { contractName } = action.newContract;
  const newPortfolio = { ...state.portfolio };
  newPortfolio[contractName] = action.newContract;
  newPortfolio[contractName].price = getPrice(
    newPortfolio[contractName],
    state.stockData
  );
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
};

const updateContract = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  newPortfolio[action.contractName][action.property] = action.value;
  newPortfolio[action.contractName].price = getPrice(
    newPortfolio[action.contractName],
    state.stockData
  );
  return { portfolio: newPortfolio, ...state };
};

const setPortfolio = (state, action) => {
  return action.newPortfolio;
};

const updatePrices = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  for (let key in newPortfolio) {
    const contract = newPortfolio[key];
    contract.price = getPrice(contract, state.stockData);
  }
  return { portfolio: newPortfolio, ...state };
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Portfolio
    case cts.ADD_CONTRACT:
      return addContract(state, action);
    case cts.RESET_PORTFOLIO:
      return resetPortfolio(state, action);
    case cts.SET_PORTFOLIO:
      return setPortfolio(state, action);
    case cts.REMOVE_CONTRACT:
      return removeContract(state, action);
    case cts.UPDATE_CONTRACT:
      return updateContract(state, action);
    case cts.UPDATE_PRICES:
      return updatePrices(state, action);

    // Stock Data
    case cts.UPDATE_PRICE:
      return {
        ...state,
        stockData: { ...state.stockData, currentPrice: action.price },
      };
    case cts.UPDATE_VOLATILITY:
      return {
        ...state,
        stockData: { ...state.stockData, volatility: action.volatility },
      };
    case cts.UPDATE_INTEREST:
      return {
        ...state,
        stockData: { ...state.stockData, interest: action.interest },
      };
    case cts.UPDATE_TICKER:
      return {
        ...state,
        stockData: { ...state.stockData, ticker: action.ticker },
      };
    case cts.RESET_DATA:
      return { ...state, stockData: { ...stockDataInitialState } };
    default:
      // Will be run initially
      return state;
  }
};
