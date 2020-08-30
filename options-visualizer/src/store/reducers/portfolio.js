import * as cts from "../actions/portfolio";
import {
  initialPortfolio,
  updatePortfolioPrices,
} from "../../utility/constants";
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
  updatePortfolioPrices(newPortfolio, state.stockData);
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
};

const updateContract = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  newPortfolio[action.contractName][action.property] = action.value;
  updatePortfolioPrices(newPortfolio, state.stockData);
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
};

const setPortfolio = (state, action) => {
  updatePortfolioPrices(action.newPortfolio, state.stockData);
  return { portfolio: action.newPortfolio, stockData: { ...state.stockData } };
};

const updatePrices = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  updatePortfolioPrices(newPortfolio, state.stockData);
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
};

const updateStockData = (state, action) => {
  const newStockData = { ...state.stockData };
  newStockData[action.property] = action.value;
  const newPortfolio = { ...state.portfolio };
  updatePortfolioPrices(newPortfolio, newStockData);
  return {
    portfolio: newPortfolio,
    stockData: newStockData,
  };
};

const updateAllContracts = (state, action) => {
  const newPortfolio = { ...state.portfolio };
  for (let key in newPortfolio) {
    const contract = newPortfolio[key];
    contract[action.property] = action.value;
  }
  updatePortfolioPrices(state.portfolio, state.stockData);
  return { portfolio: newPortfolio, stockData: { ...state.stockData } };
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
    case cts.UPDATE_ALL_CONTRACTS:
      return updateAllContracts(state, action);

    // Stock Data
    case cts.UPDATE_STOCK_DATA:
      return updateStockData(state, action);
    case cts.RESET_DATA:
      return { ...state, stockData: { ...stockDataInitialState } };
    default:
      // Will be run initially
      return state;
  }
};
