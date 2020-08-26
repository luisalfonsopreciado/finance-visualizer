import React, { useState, useCallback } from "react";
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
import Error from "./components/Error/Error";
import SecurityInfo from "./components/SecurityInfo";
import Slider from "./components/Slider";
import AnyChart from "./components/StockAnyChart";
import { Switch } from "@material-ui/core";
import { Button, FormGroup, FormControlLabel } from "@material-ui/core";
import HighChart from "./components/PayoffHighChart";

const App = () => {
  const [portfolio, setPortfolio] = useState(util.initialPortfolio);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [stockErrors, setStockErrors] = useState(null);
  const stockData = useSelector((state) => state.stockData);
  const [liveMode, setLiveMode] = useState(false);
  const [optionData, setOptionData] = useState();
  const [minX, setMinX] = useState();
  const [maxX, setMaxX] = useState();
  const [stockChartData, setStockChartData] = useState();
  const [viewHighChart, setViewHighChart] = useState(false);
  const value = { liveMode, setLiveMode };
  const dispatch = useDispatch();
  const { volatility, interest } = useSelector((state) => state.stockData);

  // Set Error Message as JSX
  const setErrs = useCallback((message) => {
    setErrors(<Error removeFunc={() => setErrors(null)}>{message}</Error>);
  }, []);

  // Set Error Stock Message as JSX
  const setStockErrs = useCallback((message) => {
    setStockErrors(
      <Error removeFunc={() => setStockErrors(null)}>{message}</Error>
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
    if (isNaN(+stockData.interest))
      return setErrs("Please Enter a Valid Interest Rate");

    const strikes = [];
    let maxStrike = 0;
    let minStrike = Infinity;

    const values = [];
    const theoretical = [];

    // Add the min/max x values input by the user and update the max/minStrikes
    if (maxX) {
      if (+maxX > maxStrike) maxStrike = +maxX;
      if (+maxX < minStrike) minStrike = +maxX;
      strikes.push(+maxX);
    }

    if (minX) {
      if (+minX > maxStrike) maxStrike = +minX;
      if (+minX < minStrike) minStrike = +minX;
      strikes.push(+minX);
    }

    // Get the Critical strikes to plot
    for (let id in portfolio) {
      const contract = portfolio[id];
      const cashContract = contract.type === util.CASH;
      const strike = cashContract ? +stockData.currentPrice : +contract.strike;
      const date = contract.date;
      const amount = contract.amount;

      // Always Validate Amount
      if (amount <= 0) return setErrs("Please Enter a Valid Amount");

      // If not a Cash Contract then validate the following fields
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

    const average = (maxStrike + minStrike) / 2;
    let max = 0;

    // If maxX is set
    if (!maxX) {
      // Auto xMax margin
      max = Math.floor(maxStrike + average * 0.2);
    } else {
      max = Math.max(+maxX, maxStrike);
    }

    let min = 0;

    // If minX is set
    if (!minX) {
      // Auto xMin Margin
      min = Math.floor(minStrike - average * 0.2);
    } else {
      min = Math.min(+minX, minStrike);
    }

    const change = (max - min) / 35;

    // Add domain limits
    strikes.push(min);
    strikes.push(max);

    setMaxX(max);
    setMinX(min);

    let i = min;
    // Add The rest of the strikes for continuous feel
    while (i < max) {
      strikes.push(i);
      i += change;
    }

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
        disabled: true,
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
      disabled: false,
    };

    // The Theoretical strategy plot data
    const strategyTheoretical = {
      values: theoretical,
      key: "Today",
      color: "pink",
      disabled: false,
    };

    result.push(strategyTheoretical);

    result.push(strategyData);

    // Clear the Errors
    setErrors(null);

    setData({ data: result, Ydomain });
  }, [portfolio, stockData, setErrs, maxX, minX]);

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
    setStockChartData(null); // Display Loading
    fetchData();
  }, [optionData]);

  // Custom hook used to Update/Validate portfolio whenever changed
  useUpdateEffect(() => {
    updateData();
  }, [portfolio, updateData]);

  // Fetch the option Data when Search is Clicked
  const searchFunc = async (ticker) => {
    try {
      const { data } = await axios.get(
        `https://finnhub.io/api/v1/stock/option-chain?symbol=${ticker}&token=` +
          process.env.REACT_APP_API_KEY
      );
      setOptionData(data);
      dispatch(actions.updatePrice(data.lastTradePrice));
      dispatch(actions.updateTicker(data.code));
      if (data.data.length === 0) {
        setStockErrs(util.STOCK_NO_OPTIONS, setStockErrors);
      } else {
        setStockErrors(null);
      }
    } catch (err) {
      setStockErrs(util.STOCK_ERR_FETCH, setStockErrors);
    }
  };

  const fetchData = async (ticker) => {
    var unix = Math.round(+new Date() / 1000);
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/stock/candle?symbol=TSLA&resolution=D&from=1199145600&to=${unix}&token=` +
        process.env.REACT_APP_API_KEY
    );

    const length = data.c.length;

    const result = [];

    for (let i = 0; i < length; i++) {
      result.push([
        util.UNIXToDateString(data.t[i]),
        data.o[i],
        data.h[i],
        data.l[i],
        data.c[i],
      ]);
    }
    setStockChartData(result);
  };

  return (
    <>
      <liveDataContext.Provider value={value}>
        <Navigation setPortfolio={setPortfolio} />
        <Container>
          <Row>
            <Col md={12}>
              {stockData.ticker !== "Theoretical" && <SecurityInfo />}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {liveMode && <Search searchFunc={searchFunc} />}
              {stockErrors}
            </Col>
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
              <div className="panel panel-primary">
                <div className="panel-heading">Toggle</div>
                <div className="panel-body">
                  <Slider
                    min={0}
                    max={150}
                    title={"Volatility"}
                    value={+volatility}
                    setValue={(val) => dispatch(actions.updateVolatility(val))}
                  />
                  <Slider
                    min={-20}
                    max={150}
                    title={"Interest"}
                    value={+interest}
                    setValue={(val) => dispatch(actions.updateInterest(val))}
                  />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </Col>
            <Col md={9}>
              <Row>
                <Col md={12}>
                  {errors ? errors : null}
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="panel panel-primary">
                        <div className="panel-heading">
                          Option Payoff
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={viewHighChart}
                                    onChange={() =>
                                      setViewHighChart((prev) => !prev)
                                    }
                                    aria-label="live mode switch"
                                  />
                                }
                                label={"Switch Graph Type"}
                              />
                            </FormGroup>
                        </div>
                        <div className="panel-body">
                          {!viewHighChart ? (
                            <Payoff data={data} />
                          ) : (
                            <HighChart />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <Demo /> */}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="panel panel-primary">
                    <div className="panel-heading">Change Domain</div>
                    <div className="panel-body">
                      <Col md={2}>
                        <input
                          type="number"
                          className="form-control form-control-inline"
                          placeholder="Auto"
                          onBlur={(e) => setMinX(e.target.value)}
                          // value={minX}
                        />
                      </Col>
                      <Col md={2}>
                        <input
                          type="number"
                          min="1"
                          max="5000"
                          className="form-control form-control-inline"
                          placeholder="Auto"
                          // value={maxX}
                          onBlur={(e) => setMaxX(e.target.value)}
                        />
                      </Col>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </liveDataContext.Provider>
      <Container>
        <Button onClick={fetchData}>Get Data</Button>
        <div className="panel panel-primary">
          <div className="panel-heading">Option Portfolio</div>
          <div className="panel-body">
            {stockChartData ? (
              <AnyChart data={stockChartData} ticker={stockData.ticker} />
            ) : (
              <>
                {optionData ? (
                  <h1>Loading...</h1>
                ) : (
                  <h1>Switch to live mode to view stock chart</h1>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default App;
