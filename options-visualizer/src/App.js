import React, { useEffect, useState } from "react";
import Payoff from "./components/Payoff";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";
import { useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import moment from "moment";
import { liveDataContext } from "./context/liveData";
import Search from "./components/Search";

// const optionData = await axios.get(
//   "https://finnhub.io/api/v1/stock/option-chain?symbol=AAPL&token=" +
//     process.env.REACT_APP_API_KEY
// );

const App = () => {
  const [portfolio, setPortfolio] = useState(util.initialPortfolio);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const stockData = useSelector((state) => state.stockData);
  const [liveMode, setLiveMode] = useState(false);
  const value = { liveMode, setLiveMode };

  // Update and Validate User Input Data
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

    // We want our plot to have N lines (N is the number of contracts in portfolio)
    for (let id in portfolio) {
      const contract = portfolio[id];
      const key =
        contract.direction + " " + contract.type + " " + contract.strike;
      result.push({
        values: [],
        key,
        color: "blue",
      });
    }

    // Keey track of min/max for Ydomain
    let minProfit = Infinity;
    let maxProfit = -Infinity;

    // For each strike, calculate the payoff and add it to values
    for (let strike of strikes) {
      let profitSum = 0;
      // Keep track of the index we are at
      let i = 0;
      for (let id in portfolio) {
        const contract = portfolio[id];

        // Calculate profit at given Strike
        const profitAtStrike = +util
          .evaluatePayoffFunc(contract, strike)
          .toFixed(2);

        // Update min and max Profits
        if (profitAtStrike > maxProfit) maxProfit = profitAtStrike;

        if (profitAtStrike < minProfit) minProfit = profitAtStrike;

        // Push the point at the specified strategy
        result[i].values.push({
          x: strike,
          y: profitAtStrike,
        });

        // Evaluate each contract in portfolio and add it to the y value
        profitSum += profitAtStrike;
        i++;
      }

      // Add the point to the data
      values.push({ x: strike, y: profitSum });
    }

    const Ydomain = [Math.floor(minProfit * 1.2), Math.floor(maxProfit * 1.2)];

    // The overall strategy plot data
    const strategyData = {
      values,
      key: "Strategy",
      color: "green",
    };

    // Add the overall strategy data to the end if there are two or more contracts
    if (result.length >= 2) {
      result.push(strategyData);
    }

    setData({ data: result, Ydomain });
  };

  // Reset Portfolio whenever liveMode is Toggled
  useEffect(() => {
    setErrors(null);
    setPortfolio({});
    setData(null);
  }, [liveMode]);

  // Update/Validate portfolio whenever changed
  useEffect(() => {
    setErrors(null);
    updateData();
  }, [portfolio]);

  const removeErrs = () => {
    setErrors(null);
  };

  // Set Error Message as JSX
  const setErrs = (message) => {
    setErrors(
      <div className="alert alert-danger " role="alert">
        <strong>{message}</strong>
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={removeErrs}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  };

  return (
    <liveDataContext.Provider value={value}>
      <Navigation />
      <div className="container">
        {liveMode && (
          <>
            <Search />
            <br />
          </>
        )}
        <StockData />
        <Panel
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          visualize={updateData}
          currentPrice={100}
        />
        {errors}
        <Payoff data={data} changeData={setData} errors={errors} />
      </div>
    </liveDataContext.Provider>
  );
};

export default App;
