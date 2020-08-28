import * as cts from "./constants";
import Option from "./Option";


/**
 * Evaluates a Payoff Function
 *
 * @param {Option} option An option Object
 * @param {Number} price A given stock price
 * @param {Object} stockData StockData object containing the stock currentPrice
 * @returns {Number} The value of the option/stock
 */

// Takes in option object and evaluates the payoff given the input price
export const evaluatePayoffFunc = (option, price, stockData) => {
  const cost = option.price * option.amount;
  if (option.type === cts.CALL) {
    // A call Option
    if (option.direction === cts.BUY) {
      // Long Call
      return (
        Math.max(price - parseInt(option.strike), 0) * option.amount - cost
      );
    }
    // Short Call
    return Math.min(0, option.strike - price) * option.amount + cost;
  } else if (option.type === cts.PUT) {
    // A Put Option
    if (option.direction === cts.BUY) {
      // Long Put
      return (
        Math.max(parseInt(option.strike) - price, 0) * option.amount - cost
      );
    }
    // Short Put
    return Math.min(0, price - option.strike) * option.amount + cost;
  } else if (option.type === cts.CASH) {
    // Stock
    if (option.direction === cts.BUY) {
      // Long Stock
      return (price - stockData.currentPrice) * option.amount;
    }
    // Short Stock
    return (stockData.currentPrice - price) * option.amount;
  }
};

/**
 * Calculates Stock Price Based On BS model
 *
 * @param {String} optionType The type of option - cts.CALL or cts.PUT
 * @param {Number} S Current Stock price
 * @param {Number} X Exercise Price
 * @param {Number} T Time remaining to the expiration Date (in years)
 * @param {Number} r Short-term risk free interest rate
 * @param {Number} v Standard deviation of stock price (implied volatility)
 * @returns {Number} The Price of the option
 */

export function BlackScholes(optionType, S, X, T, r, v) {
  // Unit adjustments
  v = v / 100;
  r = r / 100;
  var d1 = (Math.log(S / X) + (r + (v * v) / 2) * T) / (v * Math.sqrt(T));
  var d2 = d1 - v * Math.sqrt(T);
  if (optionType === cts.CALL) {
    return S * CND(d1) - X * Math.exp(-r * T) * CND(d2);
  } else {
    return X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);
  }
}

/* The cumulative Normal distribution function: */
function CND(x) {
  if (x < 0) {
    return 1 - CND(-x);
  } else {
    let k = 1 / (1 + 0.2316419 * x);
    return (
      1 -
      (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) *
        k *
        (0.31938153 +
          k *
            (-0.356563782 +
              k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))))
    );
  }
}
