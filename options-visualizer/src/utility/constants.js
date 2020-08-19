import moment from "moment";
export const BUY = "Buy";
export const SELL = "Sell";
export const CALL = "Call";
export const PUT = "Put";
export const CASH = "Cash";

export const STOCK_NO_OPTIONS = "This Stock Has No Available Options";
export const STOCK_ERR_FETCH = "Unable To Fetch Stock Data, Try again Later";

export const stockDataInitialState = {
  ticker: "Theoretical",
  currentPrice: 100,
  volatility: 30,
  interest: 2,
};

export const date = moment(new Date(Date.now() + 604800000)).format(
  "YYYY-MM-DD"
);

export const initialPortfolio = {
  initialPortfolioId: {
    amount: 1,
    contractName: "initialPortfolioId",
    date,
    direction: BUY,
    price: "", // To be calculated in the Contract Component
    strike: 100,
    type: CALL,
  },
};

// Function that takes in currentPrice, impliedVolatility and a number representing
// The desired deviation from the current price
export const getRelativeStrike = (currentPrice, impliedVol, N) => {
  impliedVol = impliedVol / 100;
  // Use the + operator to add integers
  return +currentPrice + (+currentPrice) * (+impliedVol) * N;
};

export const getLongCondor = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "", // To be calculated in the Contract Component
      // Strike price calculated dynamically
      strike: getRelativeStrike(currentPrice, impliedVol, -1),
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 1),
      type: CALL,
    },
  };
};

export const getShortCondor = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "", // To be calculated in the Contract Component
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 1),
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -1),
      type: PUT,
    },
  };
};

export const getBullCallSpread = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
  };
};

export const getBearPutSpread = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: PUT,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: PUT,
    },
  };
};

export const getLongStraddle = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: PUT,
    },
  };
};

export const getShortStraddle = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: SELL,
      price: "",
      strike: currentPrice,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: currentPrice,
      type: PUT,
    },
  };
};

export const getLongStradde = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: PUT,
    },
  };
};

export const getShortStrangle = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: PUT,
    },
  };
};

export const getLongButterfly = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: CALL,
    },
    secondId: {
      amount: 2,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: currentPrice,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date,
      direction: BUY,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
  };
};

export const getShortButterfly = (currentPrice, impliedVol) => {
  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, 0.5),
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date,
      direction: BUY,
      price: "",
      strike: currentPrice,
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date,
      direction: SELL,
      price: "",
      strike: getRelativeStrike(currentPrice, impliedVol, -0.5),
      type: PUT,
    },
  };
};
