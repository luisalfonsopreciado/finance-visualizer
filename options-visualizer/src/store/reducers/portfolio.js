import * as cts from "../actions/portfolio";
import { initialPortfolio, getPrice } from "../../utility/constants";
import { BlackScholes } from "../../utility/options";

export const initialState = { ...initialPortfolio };

const resetPortfolio = () => {
  return {};
};

const removeContract = (state, action) => {
  const newPortfolio = { ...state };
  delete newPortfolio[action.contractId];
  return newPortfolio;
};

const addContract = (state, action) => {
  const { contractName } = action.newContract;
  const newState = { ...state };
  newState[contractName] = action.newContract;
  newState[contractName].price = getPrice(
    newState[contractName],
    action.stockData
  );
  return newState;
};

const updateStrike = (state, action) => {
  const newPortfolio = { ...state };
  newPortfolio[action.contractName].strike = action.strike;
  newPortfolio[action.contractName].price = getPrice(
    newPortfolio[action.contractName],
    action.stockData
  );
  return newPortfolio;
};

const updateKind = (state, action) => {
  const newPortfolio = { ...state };
  newPortfolio[action.contractName].type = action.kind;
  newPortfolio[action.contractName].price = getPrice(
    newPortfolio[action.contractName],
    action.stockData
  );
  return newPortfolio;
};

const updateExpiry = (state, action) => {
  const newPortfolio = { ...state };
  newPortfolio[action.contractName].date = action.expiry;
  newPortfolio[action.contractName].price = getPrice(
    newPortfolio[action.contractName],
    action.stockData
  );
  return newPortfolio;
};

const updateAmount = (state, action) => {
  const newPortfolio = { ...state };
  newPortfolio[action.contractName].amount = action.amount;
  return newPortfolio;
};

const updateDirection = (state, action) => {
  const newPortfolio = { ...state };
  newPortfolio[action.contractName].direction = action.direction;
  newPortfolio[action.contractName].price = getPrice(
    newPortfolio[action.contractName],
    action.stockData
  );
  return newPortfolio;
};

const setPortfolio = (state, action) => {
  return action.newPortfolio;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case cts.UPDATE_AMOUNT:
      return updateAmount(state, action);
    case cts.UPDATE_DIRECTION:
      return updateDirection(state, action);
    case cts.UPDATE_EXPIRY:
      return updateExpiry(state, action);
    case cts.UPDATE_KIND:
      return updateKind(state, action);
    case cts.UPDATE_STRIKE:
      return updateStrike(state, action);
    case cts.ADD_CONTRACT:
      return addContract(state, action);
    case cts.RESET_PORTFOLIO:
      return resetPortfolio();
    case cts.SET_PORTFOLIO:
      return setPortfolio(state, action);
    case cts.REMOVE_CONTRACT:
      return removeContract(state, action);

    default:
      // Will be run initially
      return state;
  }
};
