import moment from "moment";
import { BlackScholes } from "./options";

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

export const updatePortfolioPrices = (portfolio, stockData) => {
  for (let key in portfolio) {
    const contract = portfolio[key];
    if (contract.type === CASH) {
      contract.price = stockData.currentPrice;
    } else {
      contract.price = getPrice(contract, stockData);
    }
    contract.debitCredit =
      contract.direction === SELL ? contract.price : -contract.price;
  }
};

const getPrice = (contract, stockData) => {
  const timeDiff = dateDiffInYears(contract.date);
  return round(
    BlackScholes(
      contract.type,
      stockData.currentPrice,
      contract.strike,
      timeDiff,
      stockData.interest,
      stockData.volatility
    )
  );
};

/**
 * Round a number to a given number of digits
 *
 * @param {Number | String} num The number to round
 * @param {Number | null} n The number of significant digits, defaults to 2
 * @returns {Number} The rounded number
 */

// Round a Number
export const round = (num, n = 2) => {
  // If it is a string convert it to num
  if (typeof num === "string") {
    num = +num;
  }
  let res = num.toFixed(n);
  return +res;
};

/**
 * Converts a UNIX Timestamp to Date String in the format: YYYY-MM-DD
 *
 * @param {Number} UNIX_timestamp A unix timestamp
 * @returns {String} Date String in the format: YYYY-MM-DD
 */

export const UNIXToDateString = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
  return moment(a).format("YYYY-MM-DD");
};

/**
 * Adds a number of days to a given date object
 *
 * @param {Date} dayObject A Date Object
 * @param {Number} days The number of days to be added
 * @returns {Date} Date Object after adding the days
 */

// Function that adds num days to a date object
export const addDays = (dayObject, days) => {
  var date = new Date(dayObject.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Creates a Date String of Format YYYY-MM-DD after N years from the present
 *
 * @param {Number} n The number of years to be added
 * @returns {Date} Date Object after adding the years
 */

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

/**
 * Gets the difference between two dates in years
 *
 * @param {Date} futureDate The Future Date
 * @param {Date} currentDate The Past Date, defaults to the present Date
 * @returns {Date} Date Object after adding the years
 */

export const dateDiffInYears = (futureDate, currentDate = new Date()) => {
  return -moment(currentDate).diff(futureDate, "years", true);
};

// Create the initialPortfolio

// Date used in initial portfolio
export const date = createDateNYearsFromNow(1);

const initialPortfolioId = {
  amount: 1,
  contractName: "initialPortfolioId",
  date,
  direction: BUY,
  strike: 100,
  type: CALL,
};

const price = getPrice(initialPortfolioId, stockDataInitialState);

initialPortfolioId.price = price;

initialPortfolioId.debitCredit = price;

// The initial Theoretical Option Portfolio
export const initialPortfolio = {
  initialPortfolioId,
};

/* Function that takes in currentPrice, impliedVolatility and a number representing
The desired deviation from the current price. Used when calculating strikes on option
strategies */
export const getRelativeStrike = (
  currentPrice,
  impliedVol,
  N,
  optionData,
  type,
  interest
) => {
  let strike =
    round(currentPrice) + round(currentPrice) * round(impliedVol / 100) * N;

  if (!optionData) {
    const dateDiff = dateDiffInYears(date);
    const price = BlackScholes(
      type,
      currentPrice,
      strike,
      dateDiff,
      interest,
      impliedVol
    );
    return { strike, date, price };
  }
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

  const dateDiff = dateDiffInYears(actualDate);
  const price = round(
    BlackScholes(
      type,
      currentPrice,
      finalStrike,
      dateDiff,
      interest,
      impliedVol
    )
  );

  return { strike: finalStrike, date: actualDate, price };
};

// Return a long condor strategy option portfolio, given the currentprice, volatility
// and live option data.
export const getLongCondor = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -1,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: thirdStrike,
    date: thirdDate,
    price: thirdPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: fourthStrike,
    date: fourthDate,
    price: fourthPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    1,
    optionData,
    CALL,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: SELL,
      price: thirdPrice,
      strike: thirdStrike,
      type: CALL,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: BUY,
      price: fourthPrice,
      strike: fourthStrike,
      type: CALL,
    },
  };
};

export const getShortCondor = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    1,
    optionData,
    CALL,
    interest
  );

  const {
    strike: thirdStrike,
    date: thirdDate,
    price: thirdPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT,
    interest
  );

  const {
    strike: fourthStrike,
    date: fourthDate,
    price: fourthPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -1,
    optionData,
    PUT,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: thirdPrice,
      strike: thirdStrike,
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: SELL,
      price: fourthPrice,
      strike: fourthStrike,
      type: PUT,
    },
  };
};

export const getBullCallSpread = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: CALL,
    },
  };
};

export const getBearPutSpread = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(currentPrice, impliedVol, 0, optionData, PUT, interest);

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: PUT,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongStraddle = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(currentPrice, impliedVol, 0, optionData, PUT, interest);

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: BUY,
      price: secondPrice,
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getShortStraddle = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(currentPrice, impliedVol, 0, optionData, PUT, interest);

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: SELL,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongStradde = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: BUY,
      price: secondPrice,
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getShortStrangle = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: SELL,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: PUT,
    },
  };
};

export const getLongButterfly = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    CALL,
    interest
  );

  const {
    strike: thirdStrike,
    date: thirdDate,
    price: thirdPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 2,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: thirdPrice,
      strike: thirdStrike,
      type: CALL,
    },
  };
};

export const getShortButterfly = (
  currentPrice,
  impliedVol,
  optionData,
  interest
) => {
  const {
    strike: firstStrike,
    date: firstDate,
    price: firstPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    CALL,
    interest
  );

  const {
    strike: secondStrike,
    date: secondDate,
    price: secondPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.5,
    optionData,
    CALL,
    interest
  );

  const {
    strike: thirdStrike,
    date: thirdDate,
    price: thirdPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    0.0,
    optionData,
    PUT,
    interest
  );

  const {
    strike: fourthStrike,
    date: fourthDate,
    price: fourthPrice,
  } = getRelativeStrike(
    currentPrice,
    impliedVol,
    -0.5,
    optionData,
    PUT,
    interest
  );

  return {
    firstId: {
      amount: 1,
      contractName: "firstId",
      date: firstDate,
      direction: BUY,
      price: firstPrice,
      strike: firstStrike,
      type: CALL,
    },
    secondId: {
      amount: 1,
      contractName: "secondId",
      date: secondDate,
      direction: SELL,
      price: secondPrice,
      strike: secondStrike,
      type: CALL,
    },
    thirdId: {
      amount: 1,
      contractName: "thirdId",
      date: thirdDate,
      direction: BUY,
      price: thirdPrice,
      strike: thirdStrike,
      type: PUT,
    },
    fourthId: {
      amount: 1,
      contractName: "fourthId",
      date: fourthDate,
      direction: SELL,
      price: fourthPrice,
      strike: fourthStrike,
      type: PUT,
    },
  };
};
