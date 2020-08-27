import moment from "moment";
export const BUY = "Buy";
export const SELL = "Sell";
export const CALL = "Call";
export const PUT = "Put";
export const CASH = "Cash";

// Some Error Message variables
export const STOCK_NO_OPTIONS = "This Stock Has No Available Options";
export const STOCK_ERR_FETCH = "Unable To Fetch Stock Data, Try again Later";

// Initial Stock Data State
export const stockDataInitialState = {
  ticker: "Theoretical",
  currentPrice: 100,
  volatility: 30,
  interest: 2,
};

// Round a Number
export const round = (num) => {
  // If it is a string convert it to num
  if (typeof num === "string") {
    num = +num;
  }
  let res = num.toFixed(2);
  return +res;
};

// Convert UNIX Timestamp to Date String: YYYY-MM-DD
export const UNIXToDateString = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
  return moment(a).format("YYYY-MM-DD");
};

// Function that adds num days to a date object
export const addDays = (dayObject, days) => {
  var date = new Date(dayObject.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Create a Date 1 year from now, used as default date on contract
const createDateNYearsFromNow = (n) => {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  console.log(year);
  var c = new Date(year + n, month, day);
  return moment(c).format("YYYY-MM-DD");
};

export const dateDiffInYears = (futureDate, currentDate = new Date()) => {
  return -moment(currentDate).diff(futureDate, "years", true);
};

// Date used in initial portfolio
export const date = createDateNYearsFromNow(1);

// The initial Theoretical Option Portfolio
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

/* Function that takes in currentPrice, impliedVolatility and a number representing
The desired deviation from the current price. Used when calculating strikes on option
strategies */
export const getRelativeStrike = (
  currentPrice,
  impliedVol,
  N,
  optionData,
  type
) => {
  let strike =
    round(currentPrice) + round(currentPrice) * round(impliedVol / 100) * N;

  if (!optionData) return { strike, date };
  // Adjust According to OptionData

  /*
    Steps:
    1. Find Find a date that is the closest to one year from now given optionData
    2. Given the date, find a strike that is closest to the relative strike that 
    was calculated previously.
  */

  // Find a date that is the closest to one year from now given optionData
  const targetDate = createDateNYearsFromNow(1);
  let min = Infinity;
  let actualDate = null;

  for (let key in optionData.data) {
    const { expirationDate } = optionData.data[key];
    // Take Math abs so that we get a number in the future
    const dateDiff = Math.abs(dateDiffInYears(expirationDate, targetDate));
    if (dateDiff < min) {
      min = dateDiff;
      actualDate = expirationDate;
    }
  }

  let finalStrike = strike;
  // For each of the option contracts with the given exp Date find the one closest
  // To the calculated strike price
  for (let key in optionData.data) {
    const { options, expirationDate } = optionData.data[key];
    if (expirationDate === actualDate) {
      let minDiffStrike = Infinity;
      for (let option of options[type.toUpperCase()]) {
        if (Math.abs(option.strike - strike) < minDiffStrike) {
          minDiffStrike = Math.abs(option.strike - strike);
          finalStrike = option.strike;
        }
      }
    }
  }
  return { strike: finalStrike, date: actualDate };
};

// Return a long condor strategy option portfolio, given the currentprice, volatility
// and live option data.
export const getLongCondor = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -1,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    CALL
  );

  const { strike: thirdStrike, date: thirdDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  const { strike: fourthStrike, date: fourthDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    1,
    optionData,
    CALL
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "", // To be calculated in the Contract Component
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: SELL,
      price: "",
      strike: thirdStrike,
      type: CALL,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: BUY,
      price: "",
      strike: fourthStrike,
      type: CALL,
    },
  };
};

export const getShortCondor = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    1,
    optionData,
    CALL
  );

  const { strike: thirdStrike, date: thirdDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT
  );

  const { strike: fourthStrike, date: fourthDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -1,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: "",
      strike: thirdStrike,
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: SELL,
      price: "",
      strike: fourthStrike,
      type: PUT,
    },
  };
};

export const getBullCallSpread = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: CALL,
    },
  };
};

export const getBearPutSpread = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    PUT
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: PUT,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongStraddle = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: BUY,
      price: "",
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getShortStraddle = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: SELL,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongStradde = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: BUY,
      price: "",
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getShortStrangle = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: SELL,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongButterfly = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    CALL
  );

  const { strike: thirdStrike, date: thirdDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 2,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: "",
      strike: thirdStrike,
      type: CALL,
    },
  };
};

export const getShortButterfly = (currentPrice, impliedVol, optionData) => {
  const { strike: firstStrike, date: firstDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    CALL
  );

  const { strike: secondStrike, date: secondDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL
  );

  const { strike: thirdStrike, date: thirdDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    PUT
  );

  const { strike: fourthStrike, date: fourthDate } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: "",
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: "",
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: "",
      strike: thirdStrike,
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: SELL,
      price: "",
      strike: fourthStrike,
      type: PUT,
    },
  };
};
