import React, { useEffect, useState } from "react";
import Payoff from "./components/Payoff";
import "./App.css";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";
import { Provider, useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import moment from "moment";
import stockData from "./store/reducers/stockData";

// const optionData = await axios.get(
//   "https://finnhub.io/api/v1/stock/option-chain?symbol=AAPL&token=" +
//     process.env.REACT_APP_API_KEY
// );

const initialPortfolio = {
  "2020-08-12T19:58:01.033Z": {
    amount: 1,
    contractName: "2020-08-12T19:58:01.033Z",
    date: "2020-08-12",
    direction: "Buy",
    price: "196.26",
    strike: "1200",
    type: "Call",
  },
};

const App = () => {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [tickers, setTickers] = useState([{ value: "Select a Ticker Symbol" }]);
  const stockData = useSelector((state) => state.stockData);

  const fetchData = async () => {
    // const data = await util.getTickerSymbols();
    // data.shift({ value: "Select a Ticker Symbol" });
    // const data2 = data.slice(data.length / 2);
    // console.log(data2)
    // console.log(data)
    // setTickers(data);
  };

  const updateData = () => {
    if (Object.keys(portfolio).length === 0)
      return setErrs("Add contracts to Visualize");

    // Validate Stock Price
    if (+stockData.currentPrice <= 0)
      return setErrs("Please Enter a Valid Stock Price");

    // Validate Interest
    if (+stockData.interest <= 0)
      return setErrs("Please Enter a Valid Interest Rate");

    const strikes = [];
    let maxStrike = 0;
    let minStrike = Infinity;

    const values = [];

    // Get the strikes to plot
    for (let id in portfolio) {
      const contract = portfolio[id];
      const strike = +contract.strike;
      const date = contract.date;
      const amount = contract.amount;

      // Validate Strike prices
      if (strike <= 0) return setErrs("Please Enter A Valid Strike Price");

      // Validate Amount
      if (amount <= 0) return setErrs("Please Enter a Valid Amount");

      // Validate the Date (Check if it is defined and in the future)
      if (!date || moment().diff(date) > 0)
        return setErrs("Please Enter a Valid Date");

      // Apply To Fixed
      strikes.push(strike.toFixed(2));

      // Update the maxStrike
      if (strike > maxStrike) maxStrike = strike;
      if (strike < minStrike) minStrike = strike;
    }

    // Add domain limits
    strikes.push(Math.floor(maxStrike * 1.2));
    strikes.push(Math.floor(minStrike * 0.8));

    // Sort the strikes so the graph can be displayed properly
    strikes.sort((a, b) => a - b);

    const result = [];

    for (let id in portfolio) {
      const contract = portfolio[id];

      result.push({
        values: [],
        key: contract.direction + " " + contract.type + " " + contract.strike,
        color: "blue",
      });
    }
    let i = 0;
    // For each strike, calculate the payoff and add it to values
    for (let strike of strikes) {
      let y = 0;
      const contractValues = [];
      let i = 0;
      for (let id in portfolio) {
        const contract = portfolio[id];

        // Push the point at the specified strategy
        result[i].values.push({
          x: strike,
          y: util.evaluatePayoffFunc(contract, strike),
        });

        // Evaluate each contract in portfolio and add it to the y value
        y += util.evaluatePayoffFunc(contract, strike);
        i++;
      }

      i++;
      // Add the point to the data
      values.push({ x: strike, y });
    }

    const strategyData = {
      values,
      key: "Strategy",
      color: "green",
    };

    result.push(strategyData);

    // Define the data and pass the values
    const data = result;

    console.log(data);

    setData(data);
  };

  useEffect(() => {
    setErrors(null);
    updateData();
  }, [portfolio]);

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

  // console.log(data);
  // console.log(portfolio);

  return (
    <>
      {/* <Navigation /> */}
      <div className="container">
        <StockData />
        <Panel
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          visualize={updateData}
          currentPrice={100}
        />
        {errors}
        <Payoff data={data} changeData={setData} errors={errors} />
        {/* <button onClick={() => setErrs("This is an Error!")}>Set Error</button> */}
      </div>
    </>
  );
};

export default App;
