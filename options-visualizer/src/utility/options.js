import * as cts from "./constants";

export const getPayoffData = (options) => {
  const maxStrike = getMaxStrike(options);
  const length = Math.floor(maxStrike * 1.25);
  const keys = Object.keys(options);
  const data = new Array(length).fill(0);
  const labels = [];
  const cost = getTotalCost(options);

  for (let i = 0; i < data.length; i++) {
    labels.push(i);
    fillPayoffArray(data, i, options, keys, cost);
  }

  return { data, labels };
};

export const evaluatePayoffFunc = (option, price) => {
  if (option.type === cts.CALL) {
    if (option.direction === cts.BUY) {
      return Math.max(price - parseInt(option.strike), 0) * option.amount;
    }
    return Math.min(0, option.strike - price) * option.amount;
  } else if (option.type === cts.PUT) {
    if (option.direction === cts.BUY) {
      return Math.max(parseInt(option.strike) - price, 0) * option.amount;
    }
    return Math.min(0, price - option.strike) * option.amount;
  } else if (option.type === cts.CASH) {
    if (option.direction === cts.BUY) {
      return (price - option.strike) * option.amount;
    }
    return (option.strike - price) * option.amount;
  }
};

export const getMaxStrike = (options) => {
  const keys = Object.keys(options);
  let max = 0;
  keys.forEach((key) => {
    if (options[key].strike > max) {
      max = options[key].strike;
    }
  });
  return max;
};

const fillPayoffArray = (matrix, index, options, keys, cost) => {
  for (let i = 0; i < keys.length; i++) {
    matrix[index] += evaluatePayoffFunc(options[keys[i]], index) - cost;
  }
};

const getTotalCost = (options) => {
  const keys = Object.keys(options);
  let cost = 0;
  keys.forEach((key) => {
    if (options[key].contractName.includes("SHORT")) {
      cost -= options[key].bid * options[key].amount;
    } else {
      cost += options[key].ask * options[key].amount;
    }
  });
  return cost;
};

/* Idea behind displaying the graph

 1. Get the Critical X values in the graph
 2. Evaluate the critical X values and add them to the proper format
 3. Update the state and render the result

 1. How to find critical x values
  - x = 0 will always be a critical value
  - x = strike prices will always be c.v
  - x = maxStrike * 1.2 will always be critical value

2. We have defined a evaluatePayoffFunc above and use it in all critical points

 */

 /*
  S = Current Stock Price
  X = Exercise Price (Strike)
  r = Short-term risk free interest rate
  T = Time remaining to the expiration Date (in years)
  v = Standard deviation of stock price (implied volatility)
 */

export function BlackScholes(optionType, S, X, T, r, v) {
  var d1 = (Math.log(S / X) + (r + (v * v) / 2) * T) / (v * Math.sqrt(T));
  var d2 = d1 - v * Math.sqrt(T);
  if (optionType === cts.CALL) {
    return S * CND(d1) - X * Math.exp(-r * T) * CND(d2);
  } else {
    return X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);
  }
}

/* The cummulative Normal distribution function: */
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
