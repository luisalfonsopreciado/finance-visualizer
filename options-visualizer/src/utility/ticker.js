import axios from "axios";

export const getTickerSymbols = (instrument) => {
  let type = instrument;
  let exchange = "";

  switch (type) {
    case "stock":
      exchange = "US";
      break;
    case "forex":
      exchange = "oanda";
      break;
    case "crypto":
      exchange = "binance";
      break;
    default:
      type = "stock";
      exchange = "US";
  }

  return new Promise((resolve, reject) => {
    const url =
      "https://finnhub.io/api/v1/" +
      type +
      "/symbol?exchange=" +
      exchange +
      "&token=" +
      process.env.REACT_APP_API_KEY;
    axios
      .get(url)
      .then((res) => {
        const tickers = [];
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const t = data[i].symbol;
          tickers.push({
            key: i,
            value: t,
            displayValue: t + " " + data[i].description,
          });
        }
        resolve(tickers);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getOptionData = (
  ticker,
  expirationDate,
  optionType,
  optionListView
) => {
  const url =
    "https://finnhub.io/api/v1/stock/option-chain?symbol=" +
    ticker +
    "&token=" +
    process.env.REACT_APP_API_KEY;

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => {
        const data = res.data.data;
        let result = [];
        for (let i = 0; i < data.length; i++) {
          if (expirationDate.localeCompare(data[i].expirationDate) === 0) {
            if (optionListView) {
              result = data[i].options[optionType];
            } else {
              result = data[i].options.CALL;
            }

            break;
          }
        }
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
