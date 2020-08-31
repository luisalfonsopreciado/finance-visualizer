import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import portfolioReducer from "./store/reducers/portfolio";
import { createStore, combineReducers } from "redux";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { grey, } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: grey[800],
    },
    secondary: {
      main: grey[200],
    },
  },
});

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
});

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
