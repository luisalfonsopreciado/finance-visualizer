import React, { Component } from "react";
import Payoff from "./components/Payoff";
import "./App.css";
import axios from "axios";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";

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

class App extends Component {
  state = {
    currentPrice: "",
    volatility: "",
    interest: "",
    portfolio: {},
    data: data1,
    errors: null,
  };

  fetchData = async () => {
    const data = await util.getTickerSymbols();
    const optionData = await axios.get(
      "https://finnhub.io/api/v1/stock/option-chain?symbol=AAPL&token=" +
        process.env.REACT_APP_API_KEY
    );
  };

  visualize = () => {
    this.updateData(this.state.portfolio);
  };

  updateData = (portfolio) => {
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

    this.setState({ data });
  };

  changeData = () => {
    this.setState({ data: data2 });
  };

  componentDidMount() {
    this.fetchData();
  }

  setPrice = (price) => {
    this.setState({ currentPrice: price });
  };

  setVolatility = (volatility) => {
    this.setState({ volatility });
  };

  setInterest = (interest) => {
    this.setState({ interest });
  };

  setPortfolio = (portfolio) => {
    this.setState({ portfolio });
  };

  setErrors = (message) => {
    this.setState({
      errors: (
        <div class="alert alert-danger" role="alert">
          {message}
        </div>
      ),
    });
  };

  render() {
    console.log(this.state.portfolio);
    return (
      <div className="container">
        <StockData
          data={this.state}
          setPrice={this.setPrice}
          setVolatility={this.setVolatility}
          setInterest={this.setInterest}
        />
        <Panel
          portfolio={this.state.portfolio}
          setPortfolio={this.setPortfolio}
          visualize={this.visualize}
        />
        {this.state.errors}
        <Payoff data={this.state.data} changeData={this.changeData} />
        <button onClick={() => this.setErrors("This is an Error!")}>
          Set Error
        </button>
      </div>
    );
  }
}

export default App;
