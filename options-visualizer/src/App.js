import React, { useEffect, useState } from "react";
import Payoff from "./components/Payoff";
import "./App.css";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";
import stockDataReducer from "./store/reducers/stockData";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation";

// const optionData = await axios.get(
//   "https://finnhub.io/api/v1/stock/option-chain?symbol=AAPL&token=" +
//     process.env.REACT_APP_API_KEY
// );

const data1 = [
  {
    values: [
      { x: 0, y: 0.5 },
      { x: 1, y: 0 },
      { x: 2, y: 2 },
    ],
    key: "Sine Wave",
    color: "#ff7f0e",
  },
];

const data2 = [
  {
    values: [
      { x: 0, y: 0.5 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
    ],
    key: "Changed!",
    color: "#ff7f0e",
  },
];

const rootReducer = combineReducers({
  stockData: stockDataReducer,
});

const store = createStore(rootReducer);

const App = () => {
  const [portfolio, setPortfolio] = useState({});
  const [data, setData] = useState(data1);
  const [errors, setErrors] = useState(null);
  const [tickers, setTickers] = useState([{ value: "Select a Ticker Symbol" }]);

  const fetchData = async () => {
    // const data = await util.getTickerSymbols();
    // data.shift({ value: "Select a Ticker Symbol" });
    // const data2 = data.slice(data.length / 2);
    // console.log(data2)
    // console.log(data)
    // setTickers(data);
  };

  const visualize = () => {
    updateData(portfolio);
  };

  const updateData = (portfolio) => {
    const strikes = [];
    let maxStrike = 0;

    const values = [];

    // x = 0 will always be on the graph
    strikes.push(0);

    // Get the strikes to plot
    for (let id in portfolio) {
      const contract = portfolio[id];
      const strike = +contract.strike;
      strikes.push(strike);
      if (strike > maxStrike) maxStrike = strike;
    }

    // Add x = max strike * 1.2 to the plot
    strikes.push(Math.min(maxStrike * 1.2));

    console.log(strikes);

    // For each strike, calculate the payoff and add it to values
    for (let strike of strikes) {
      let y = 0;
      for (let id in portfolio) {
        const contract = portfolio[id];
        y += util.evaluatePayoffFunc(contract, strike) - 5; // For now each contract costs 5 bucks
      }
      values.push({ x: strike, y });
    }

    const data = [
      {
        values,
        key: "Test",
        color: "blue",
      },
    ];

    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setErrs = (message) => {
    setErrors(
      <div class="alert alert-danger" role="alert">
        {message}
      </div>
    );
  };

  return (
    <Provider store={store}>
      <Navigation />
      <div className="container">
        <StockData />
        <Panel
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          visualize={visualize}
          currentPrice={100}
        />
        {errors}
        <Payoff data={data} changeData={setData} />
        <button onClick={() => setErrs("This is an Error!")}>Set Error</button>
      </div>
    </Provider>
  );
};

export default App;
