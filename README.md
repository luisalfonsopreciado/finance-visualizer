<h1 align="center">
  <img width="100%" height="200px" src="./.github/github_icon.png" alt="Icon" />

Option Strategy Visualizer

</h1>

<h4 align="center">
  Web application that makes it easy for users to build and visualize option trading strategies. This project was created for the <a href="https://www.youtube.com/watch?v=X_52RUQTdgs">Software Engineering Project CONTEST - Summer/Fall 2020</a> hosted by AlgoExpert.
</h4>

## About

Option Strategy Visualizer was built using the Javascript frontend framework <a href="https://github.com/facebook/react">React</a>. Its objective is to facilitate build option trading strategies through visualization.

## Technologies

This project was developed with the following technologies:

- [ReactJS](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Axios](https://github.com/axios/axios)
- [HighCharts](https://www.highcharts.com/)
- [D3.js](https://d3js.org/)
- [NVD3.js](https://nvd3.org/)
- [NodeJs](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [VS Code](https://code.visualstudio.com/) with [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Use

To view the complete project <a href="https://luisalfonsopreciado.github.io/finance-visualizer/">Click Here</a>

---

## Functionality

- Add Option/Remove contracts and visualize the payoff diagram in real time.
- Use Theoretical data to build a strategy.
- Build an option strategy with real time stock data.
- Visualize the option greeks.
- Build Popular strategies such as spreads, straddles, butterflies, condors, among others.


Made by Luis Alfonso Preciado [Get in touch!](https://www.linkedin.com/in/luis-alfonso-preciado-91256015b/)

## Environment Setup

Make sure you have a .env-cmdrc.json file in the options-visualizer directory. This file defines the environment variables when the app is run.

The .env-cmdrc.json file should have the following properties.

```
{
  "env": {
    "REACT_APP_API_KEY": "",
    "REACT_APP_API_URL": "",
    "REACT_APP_HOST" : ""
  },
  "dev": {
    "REACT_APP_API_KEY": "",
    "REACT_APP_API_URL": "http://localhost:8000",
    "REACT_APP_HOST": "http://localhost:3000"
  }
}
```

REACT_APP_API_KEY should have a valid API key from [Finnhub](https://finnhub.io/)/

REACT_APP_API_URL should have the url location of the backend service to store option strategy data.

REACT_APP_HOST should contain the name of the host.
