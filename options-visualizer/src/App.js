import React, { useState, useCallback, useEffect } from "react";
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
import * as actions from "./store/actions/portfolio";
import useUpdateEffect from "./hooks/useUpdateEffect";
import Error from "./components/Error/Error";
import SecurityInfo from "./components/SecurityInfo";
import Slider from "./components/Slider";
import AnyChart from "./components/StockAnyChart";
import { Switch, Typography, makeStyles } from "@material-ui/core";
import { FormGroup, FormControlLabel, Container } from "@material-ui/core";
import { Card, CardHeader, CardContent, TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import HighChart from "./components/PayoffHighChart";
import HighStock from "./components/HighStock";

const useStyles = makeStyles({
  payoff: {
    height: "100%",
  },
});

const App = () => {
  const { portfolio, stockData } = useSelector((state) => state.portfolio);
  const { volatility, interest, currentPrice } = stockData;
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [stockErrors, setStockErrors] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [optionData, setOptionData] = useState();
  const [minX, setMinX] = useState();
  const [maxX, setMaxX] = useState();
  const [stockChartData, setStockChartData] = useState();
  const [viewHighChart, setViewHighChart] = useState(true);
  const [viewHighStock, setViewHighStock] = useState(true);
  const [hcData, setHcData] = useState(null);
  const value = { liveMode, setLiveMode };
  const [daysToExpiration, setDaysToExpiration] = useState(null);
  const classes = useStyles();

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
  const updateData = () => {
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
      strikes.push(util.round(strike));

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
      // Round to 2 decimals and convert back to number
      strikes.push(util.round(i));
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
        const profitAtStrike = util.round(
          util.evaluatePayoffFunc(contract, strike, stockData)
        );

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
          theoreticalPL += +profitAtStrike;
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
          x: util.round(strike),
          y: util.round(profitAtStrike),
        });

        // Evaluate each contract in portfolio and add it to the y value
        profitSum += util.round(profitAtStrike);
        i++;
      }

      // Add the point to the data
      values.push({ x: util.round(strike), y: util.round(profitSum) });
      theoretical.push({ x: util.round(strike), y: util.round(theoreticalPL) });
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

    if (viewHighChart) {
      const res = [];
      // Parse data into HighChart Format
      for (let series of result) {
        const seriesInfo = {
          data: [],
          visible: !series.disabled,
          color: series.color,
          name: series.key,
        };
        res.push(seriesInfo);
        for (let point of series.values) {
          seriesInfo.data.push([+point.x, +point.y]);
        }
      }

      return setHcData({
        series: res,
        xAxis: {
          title: {
            text: "Stock Price ($)",
          },
        },
        yAxis: {
          title: {
            text: "Profit ($)",
          },
        },
        chart: {
          type: "spline",
        },
        title: {
          text: "",
        },
      });
    }

    setData({ data: result, Ydomain });
  };

  // Custom hook used to Reset Portfolio only when liveMode is Toggled
  useUpdateEffect(() => {
    // To be run on update
    setErrors(null);
    dispatch(actions.resetPortfolio());
    setData(null);
    setOptionData(null);
  }, [liveMode]);

  // Custom hook used to Reset Porfolio only when optionData changes
  useUpdateEffect(() => {
    dispatch(actions.resetPortfolio());
    setStockChartData(null); // Display Loading
    // fetchStockData();
  }, [optionData]);

  // Updating data to display
  useEffect(() => {
    updateData();
  }, [portfolio, maxX, minX, viewHighChart]);

  // Fetch the option Data when Search is Clicked
  const fetchOptionData = async (ticker) => {
    try {
      const { data } = await axios.get(
        `https://finnhub.io/api/v1/stock/option-chain?symbol=${ticker}&token=` +
          process.env.REACT_APP_API_KEY
      );
      setOptionData(data);
      dispatch(actions.updateStockData("currentPrice", data.lastTradePrice));
      dispatch(actions.updateStockData("ticker", data.code));
      if (data.data.length === 0) {
        setStockErrs(util.STOCK_NO_OPTIONS, setStockErrors);
      } else {
        setStockErrors(null);
        fetchStockData(ticker);
      }
    } catch (err) {
      setStockErrs(util.STOCK_ERR_FETCH, setStockErrors);
    }
  };

  const fetchStockData = async (ticker) => {
    var unix = Math.round(+new Date() / 1000);
    try {
      const { data } = await axios.get(
        `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=1199145600&to=${unix}&token=` +
          process.env.REACT_APP_API_KEY
      );

      const length = data.c.length;

      const result = [];

      // Unix milliseconds
      for (let i = 0; i < length; i++) {
        result.push([
          data.t[i] * 1000,
          data.o[i],
          data.h[i],
          data.l[i],
          data.c[i],
        ]);
      }
      console.log(result);
      setStockChartData(result);
    } catch (err) {
      setStockErrs(err.message + stockData.ticker);
    }
  };

  const updateDaysToExpiration = (days) => {
    let newDate = util.addDays(new Date(), days);
    newDate = moment(newDate).format("YYYY-MM-DD");
    dispatch(actions.updateAllContracts("date", newDate));
    setDaysToExpiration(days);
  };

  return (
    <>
      <liveDataContext.Provider value={value}>
        <Navigation optionData={optionData} />
        <Container>
          <Grid container>
            <Grid item md={12}>
              {stockData.ticker !== "Theoretical" && <SecurityInfo />}
            </Grid>
            <Grid item md={12}>
              <Grid container>
                {liveMode && <Search searchFunc={fetchOptionData} />}
                {stockErrors}
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Panel
                optionData={optionData}
                portfolio={portfolio}
                visualize={updateData}
              />
            </Grid>
            <Grid item md={3}>
              <Grid container>
                <Grid item md={12}>
                  <StockData liveMode={liveMode} />
                </Grid>
                <Grid item md={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Slider
                        min={0}
                        max={150}
                        title={"Volatility"}
                        value={+volatility}
                        setValue={(val) =>
                          dispatch(actions.updateStockData("volatility", val))
                        }
                      />
                      <Slider
                        min={-20}
                        max={150}
                        title={"Interest"}
                        value={+interest}
                        setValue={(val) =>
                          dispatch(actions.updateStockData("interest", val))
                        }
                      />
                      {!liveMode && (
                        <Slider
                          min={1}
                          max={1000}
                          title={"Time To Expiration"}
                          value={daysToExpiration}
                          setValue={(val) => updateDaysToExpiration(val)}
                        />
                      )}
                      {!liveMode && (
                        <Slider
                          min={0}
                          max={2000}
                          title={"StockPrice"}
                          value={currentPrice}
                          setValue={(val) =>
                            dispatch(
                              actions.updateStockData("currentPrice", val)
                            )
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={9}>
              {errors ? errors : null}
              <Card variant="outlined" className={classes.payoff}>
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!viewHighChart}
                          onChange={() => setViewHighChart((prev) => !prev)}
                          aria-label="live mode switch"
                        />
                      }
                      label={"Switch Graph Type"}
                    />
                  </FormGroup>

                  {!viewHighChart ? (
                    <Payoff data={data} />
                  ) : (
                    <HighChart data={hcData} />
                  )}
                  <Grid container>
                    <Grid item md={2}>
                      <TextField
                        id="outlined-number"
                        label="Low"
                        placeholder="Auto"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onBlur={(e) => setMinX(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={8}></Grid>
                    <Grid item md={2}>
                      <TextField
                        id="outlined-number"
                        label="High"
                        placeholder="Auto"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onBlur={(e) => setMaxX(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={12}>
              <Card variant="outlined">
                <CardContent>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!viewHighStock}
                          onChange={() => setViewHighStock((prev) => !prev)}
                          aria-label="live mode switch"
                        />
                      }
                      label={"Switch Chart Type"}
                    />
                  </FormGroup>
                  {stockChartData && optionData ? (
                    <>
                      {viewHighStock ? (
                        <HighStock
                          mockData={stockChartData}
                          ticker={stockData.ticker}
                        />
                      ) : (
                        <AnyChart
                          data={stockChartData}
                          ticker={stockData.ticker}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {optionData && liveMode ? (
                        <Typography variant="h1">Loading...</Typography>
                      ) : (
                        <>
                          {!liveMode && (
                            <>
                              <Typography variant="h1">
                                Switch to live mode to view stock chart
                              </Typography>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </liveDataContext.Provider>
    </>
  );
};

export default App;
