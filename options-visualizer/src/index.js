import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import stockDataReducer from "./store/reducers/stockData";
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  stockData: stockDataReducer,
});

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
