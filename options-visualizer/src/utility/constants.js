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

export const LONG_CONDOR = "LONG_CONDOR";

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

export const SHORT_CONDOR = "SHORT_CONDOR";

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

export const BULL_CALL_SPREAD = "BULL_CALL_SPREAD";

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

export const BEAR_PUT_SPREAD = "BEAR_PUT_SPREAD";

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

export const LONG_STRADDLE = "LONG_STRADDLE";

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

export const SHORT_STRADDLE = "SHORT_STRADDLE";

export const getLongStrangle = (
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

export const LONG_STRANGLE = "LONG_STRANGLE";

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

export const SHORT_STRANGLE = "SHORT_STRANGLE";

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

export const LONG_BUTTERFLY = "LONG_BUTTERFLY";

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

export const SHORT_BUTTERFLY = "SHORT_BUTTERFLY";

const strategyInfo = {};

strategyInfo[
  LONG_CONDOR
] = `The Long Condor can be viewed as a variation of the Long Butterfly options strategy, the difference being that the strikes of the 'wings' of the strategy are different.
   This widens the price range at which the strategy is profitable (and thus increases the probability of being profitable), but the maximum profit becomes lower, while the maximum loss increases.`;

strategyInfo[
  SHORT_CONDOR
] = `The Short Condor can be viewed as a variation of the Short Butterfly options strategy, with the legs of the strategy using different strikes instead of a single one.
  
  The strategy is constructed using options with 4 different strikes, and can be designed in a number of ways (using only calls, only puts, or both) and be either a debit or credit strategy.`;

strategyInfo[
  BULL_CALL_SPREAD
] = `The Bull Call Spread is an options strategy involving the purchase of a Call with a lower strike and the selling of a Call with a higher strike.

The motivation of the strategy is to generate a profit if the stock rises, but make the strategy cheaper than simply buying a call option. However, the Profit / Loss of a Bull Call Spread is limited (whereas the one of a plain call is unlimited).`;

strategyInfo[
  BEAR_PUT_SPREAD
] = `The Bear Put Spread is an options strategy that involves the purchase of a Put Option with a higher strike and the selling of another Put Option with a lower strike.

The sold put makes the strategy cheaper (compared to the purchase of a single put), while still allowing the investor to get a profit if the stock price decreases.

The disadvantage of a Bear Put Spread (compared to a simple Long Put position) is that the P/L of the strategy is limited.`;

strategyInfo[
  LONG_STRADDLE
] = `The Long Straddle is an options strategy involving the purchase of a Call and a Put option with the same strike.

The strategy generates a profit if the stock price rises or drops considerably.`;

strategyInfo[
  SHORT_STRADDLE
] = `The Short Straddle is an options strategy involving the simultaneous selling of a Call and a Put with the same strike.

The investor receives the premium from the sold options, and hopes that the stock price will end at the strike level (or not too far from it) on the expiry date.

The profit of a Short Straddle is limited to the premium received, whereas its loss is unlimited.`;

strategyInfo[
  LONG_STRANGLE
] = `The Long Strangle is an options strategy resembling the Long Straddle, the only difference being that the strike of the options are different: an investor is buying a Call with a higher strike and a Put with a lower strike.

The strategy generates a profit in case the stock price rises or falls significantly by the expiry date.

The Strangle is cheaper than the Straddle.`;

strategyInfo[
  SHORT_STRANGLE
] = `The Short Strangle is an options strategy similar to the Short Straddle, with one difference: the strikes of the sold options are different (you sell a Call with a higher strike and a Put with a lower strike)

The strategy will generate a profit if the stock price stays between the two strikes by the expiry date.

Compared to the Short Straddle, the Short Stangle has a lower profit, but higher probability of being profitable.`;

strategyInfo[
  LONG_BUTTERFLY
] = `The Long Butterfly is an options strategy that consists of options with 3 different strikes being sold and purchased at the same time.

The strategy can be considered as an improved version of the Short Straddle, the improvement being that the maximum loss becomes limited and thus under full control.

The Long Butterfly can be constructed in a number of ways (using only calls, using only puts, or using both), and the resulting strategies differ primarily in being either credit or debit ones.

Below you can see an example of a debit Long Butterfly made of Call options.`;

strategyInfo[
  SHORT_BUTTERFLY
] = `The Short Butterfly is an options strategy that can be considered as an improved version of a Long Straddle, the improvement being that the maximum loss becomes lower – unfortunately, at the expense of limiting the profit of the strategy.

It is constructed using options with 3 different strikes.`;

export { strategyInfo };
