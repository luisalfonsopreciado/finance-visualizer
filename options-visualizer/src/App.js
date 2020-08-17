import React, { useEffect, useState, useCallback, useRef } from "react";
import Payoff from "./components/Payoff";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import moment from "moment";
import { liveDataContext } from "./context/liveData";
import Search from "./components/Search";
import axios from "axios";
import ColorPicker from "./utility/DS/ColorPicker";
import * as actions from "./store/actions/stockData";
import { Row, Col, Container } from "react-bootstrap";
import useUpdateEffect from "./hooks/useUpdateEffect";

const App = () => {
  const [portfolio, setPortfolio] = useState(util.initialPortfolio);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const stockData = useSelector((state) => state.stockData);
  const [liveMode, setLiveMode] = useState(false);
  const [optionData, setOptionData] = useState();
  const value = { liveMode, setLiveMode };
  const dispatch = useDispatch();

  // Set Error Message as JSX
  const setErrs = useCallback((message) => {
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
  }, []);

  // Update and Validate User Input Data
  const updateData = useCallback(() => {
    // Validate Empty Portfolio
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
    const theoretical = [];

    // Get the strikes to plot
    for (let id in portfolio) {
      const contract = portfolio[id];
      const cashContract = contract.type === util.CASH;
      const strike = cashContract ? +stockData.currentPrice : +contract.strike;
      const date = contract.date;
      const amount = contract.amount;

      // Always Validate Amount
      if (amount <= 0) return setErrs("Please Enter a Valid Amount");

      // If not a Cash Contract the validate the following fields
      if (!cashContract) {
        // Validate Strike prices
        if (strike <= 0) return setErrs("Please Enter A Valid Strike Price");

        // Validate the Date (Check if it is defined and in the future)
        if (!date || moment().diff(date) > 0)
          return setErrs("Please Enter a Valid Date");
      }

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

    // Helper DS to fetch colors
    const colors = new ColorPicker();

    // We want our plot to have N lines (N is the number of contracts in portfolio)
    for (let id in portfolio) {
      const contract = portfolio[id];
      let key =
        contract.direction + " " + contract.type + " " + contract.strike;
      // Adjust title if cash contract
      if (contract.type === util.CASH) {
        key =
          contract.direction +
          " " +
          contract.type +
          "  " +
          stockData.currentPrice;
      }

      result.push({
        values: [],
        key,
        color: colors.getColor(),
      });
    }

    // Keey track of min/max for Ydomain
    let minProfit = Infinity;
    let maxProfit = -Infinity;

    // For each strike, calculate the payoff and add it to values
    for (let strike of strikes) {
      let profitSum = 0;
      let theoreticalPL = 0;
      // Keep track of the index we are at
      let i = 0;
      for (let id in portfolio) {
        const contract = portfolio[id];

        // Calculate profit at given Strike (at Expiration)
        const profitAtStrike = +util
          .evaluatePayoffFunc(contract, strike, stockData)
          .toFixed(2);

        // Calculate dateDifference in years, used in theoretical black scholes
        const dateDiff = -moment().diff(contract.date, "years", true);

        const blackScholesValue = util.BlackScholes(
          contract.type,
          +strike,
          +contract.strike,
          +dateDiff,
          +stockData.interest,
          +stockData.volatility
        );

        // If the contract is Cash
        if (contract.type === util.CASH) {
          // Just add the profit at Strike
          theoreticalPL += profitAtStrike;
        } else {
          // Calculate depending on Buy/Sell
          if (contract.direction === util.BUY) {
            // Calculate Theoretical P/L
            theoreticalPL +=
              (blackScholesValue - contract.price) * contract.amount;
          } else {
            theoreticalPL +=
              (contract.price - blackScholesValue) * contract.amount;
          }
        }

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
      theoretical.push({ x: strike, y: theoreticalPL.toFixed(2) });
    }

    const Ydomain = [Math.floor(minProfit * 1.2), Math.floor(maxProfit * 1.2)];

    // The overall strategy plot data
    const strategyData = {
      values,
      key: "Strategy",
      color: "green",
    };

    // The Theoretical strategy plot data
    const strategyTheoretical = {
      values: theoretical,
      key: "Today",
      color: "pink",
    };

    result.push(strategyTheoretical);

    // Add the overall strategy data to the end if there are two or more contracts
    if (result.length > 2) {
      result.push(strategyData);
    }

    console.log(result, Ydomain);

    setData({ data: result, Ydomain });
  }, [portfolio, stockData, setErrs]);

  // Custom hook used to Reset Portfolio only when liveMode is Toggled
  useUpdateEffect(() => {
    // To be run on update
    setErrors(null);
    setPortfolio({});
    setData(null);
    setOptionData(null);
  }, [liveMode]);

  // Custom hook used to Reset Porfolio only when optionData changes
  useUpdateEffect(() => {
    setPortfolio({});
  }, [optionData]);

  // Custom hook used to Update/Validate portfolio whenever changed
  useUpdateEffect(() => {
    setErrors(null);
    updateData();
  }, [portfolio, updateData]);

  // Remove Errors Helper Function
  const removeErrs = () => {
    setErrors(null);
  };

  // Fetch the option Data when Search is Clicked
  const searchFunc = async (ticker) => {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/stock/option-chain?symbol=${ticker}&token=` +
        process.env.REACT_APP_API_KEY
    );
    setOptionData(data);
    dispatch(actions.updatePrice(data.lastTradePrice));
  };

  console.log("App Rendered");
  console.log(data)

  return (
    <liveDataContext.Provider value={value}>
      <Navigation setPortfolio={setPortfolio} />
      <Container>
        <Row>
          <Col md={12}>{liveMode && <Search searchFunc={searchFunc} />}</Col>
        </Row>
        <Row>
          <Col md={12}>
            <Panel
              optionData={optionData}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              visualize={updateData}
              currentPrice={100}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <StockData liveMode={liveMode} />
          </Col>
          <Col md={9}>
            {errors ? errors : null}
            <Payoff data={data} />
          </Col>
        </Row>
      </Container>
    </liveDataContext.Provider>
  );
};

export default App;
