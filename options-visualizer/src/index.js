import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import portfolioReducer from "./store/reducers/portfolio"
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  portfolio: portfolioReducer
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
