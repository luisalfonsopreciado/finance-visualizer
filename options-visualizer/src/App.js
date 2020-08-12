import React, { Component } from "react";
import Payoff from "./components/Payoff";
import "./App.css";
import axios from "axios";
// import CandleStick from "./components/CandleStick";
import StockData from "./components/StockData";
import Panel from "./components/Panel";
import * as util from "./utility";

class App extends Component {
  state = {
    currentPrice: "",
    volatility: "",
    interest: "",
  };

  fetchData = async () => {
    const data = await util.getTickerSymbols();
    const optionData = await axios.get(
      "https://finnhub.io/api/v1/stock/option-chain?symbol=AAPL&token=" +
        process.env.REACT_APP_API_KEY
    );
    console.log(data);
    console.log(optionData.data);
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

  render() {
    return (
      <div className="container">
        <StockData
          data={this.state}
          setPrice={this.setPrice}
          setVolatility={this.setVolatility}
          setInterest={this.setInterest}
        />
        <Panel />
        <Payoff />
        {/* <CandleStick /> */}
      </div>
    );
  }
}

export default App;
