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
    if (option.type === "CALL") {
      if (option.contractName.includes("LONG")) {
        return Math.max(price - parseInt(option.strike), 0) * option.amount;
      }
      return Math.min(0, option.strike - price) * option.amount;
    } else if (option.type === "PUT") {
      if (option.contractName.includes("LONG")) {
        return Math.max(parseInt(option.strike) - price, 0) * option.amount;
      }
      return Math.min(0, price - option.strike) * option.amount;
    } else if (option.type === "STOCK") {
      if (option.contractName.includes("LONG")) {
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