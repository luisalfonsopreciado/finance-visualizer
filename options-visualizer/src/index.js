import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import portfolioReducer from "./store/reducers/portfolio";
import { createStore, combineReducers } from "redux";
import { ThemeProvider, createMuiTheme, Paper } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "light",
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
        <Paper>
          <App />
        </Paper>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
