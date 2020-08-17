import moment from "moment";
export const BUY = "Buy";
export const SELL = "Sell";
export const CALL = "Call";
export const PUT = "Put";
export const CASH = "Cash";

export const stockDataInitialState = {
  currentPrice: "100",
  volatility: "30",
  interest: "2",
};

const date = moment(new Date(Date.now() + 604800000)).format("YYYY-MM-DD");

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

export const longCondor = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "", // To be calculated in the Contract Component
    strike: 80,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 90,
    type: CALL,
  },
  thirdId: {
    amount: 1,
    contractName: "thirdId",
    date,
    direction: SELL,
    price: "",
    strike: 110,
    type: CALL,
  },
  fourthId: {
    amount: 1,
    contractName: "fourthId",
    date,
    direction: BUY,
    price: "",
    strike: 120,
    type: CALL,
  },
};

export const shortCondor = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "", // To be calculated in the Contract Component
    strike: 110,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 120,
    type: CALL,
  },
  thirdId: {
    amount: 1,
    contractName: "thirdId",
    date,
    direction: BUY,
    price: "",
    strike: 90,
    type: PUT,
  },
  fourthId: {
    amount: 1,
    contractName: "fourthId",
    date,
    direction: SELL,
    price: "",
    strike: 80,
    type: PUT,
  }, 
}

export const bullCallSpread = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 110,
    type: CALL,
  },
};

export const bearPutSpread = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: PUT,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 90,
    type: PUT,
  },
};

export const longStraddle = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: PUT,
  },
};

export const shortStraddle = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: SELL,
    price: "",
    strike: 100,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 100,
    type: PUT,
  },
};

export const longStrangle = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 110,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: BUY,
    price: "",
    strike: 90,
    type: PUT,
  },
};

export const shortStrangle = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: SELL,
    price: "",
    strike: 110,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 90,
    type: PUT,
  },
};

export const longButterfly = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 90,
    type: CALL,
  },
  secondId: {
    amount: 2,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 100,
    type: CALL,
  },
  thirdId: {
    amount: 1,
    contractName: "thirdId",
    date,
    direction: BUY,
    price: "",
    strike: 110,
    type: CALL,
  },
};

export const shortButterfly = {
  firstId: {
    amount: 1,
    contractName: "firstId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: CALL,
  },
  secondId: {
    amount: 1,
    contractName: "secondId",
    date,
    direction: SELL,
    price: "",
    strike: 110,
    type: CALL,
  },
  thirdId: {
    amount: 1,
    contractName: "thirdId",
    date,
    direction: BUY,
    price: "",
    strike: 100,
    type: PUT,
  },
  fourthId: {
    amount: 1,
    contractName: "fourthId",
    date,
    direction: SELL,
    price: "",
    strike: 90,
    type: PUT
  }
};
