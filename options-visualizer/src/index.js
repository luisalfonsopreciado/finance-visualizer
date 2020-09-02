import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import portfolioReducer from "./store/reducers/portfolio";
import { createStore, combineReducers } from "redux";
import { ThemeProvider, createMuiTheme, Paper } from "@material-ui/core";

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
});

const store = createStore(rootReducer);

const Index = () => {
  const [darkState, setDarkState] = useState(false);
  const palletType = darkState ? "dark" : "light";

  const theme = createMuiTheme({
    palette: {
      type: palletType,
    },
  });

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Paper>
            <App changeTheme={handleThemeChange} theme={palletType} />
          </Paper>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
