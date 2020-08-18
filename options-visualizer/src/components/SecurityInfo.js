import React, { useState, useEffect } from "react";
import { getQuoteData } from "../../shared/functions";
import classes from "./SecurityInfo.module.css";
import Button from "../UI/Button/Button";
import { withRouter } from "react-router";
import axios from "../../axios/auth";
import { connect } from "react-redux";
import { createHTTPHeaders } from "../../shared/utility";
import { useStore } from "../../hooks-store/store";

const SecurityInfo = ({ ticker, history, isAuth, token }) => {
  const [quoteData, setQuoteData] = useState({});
  const dispatch = useStore(false)[1];
  useEffect(() => {
    const func = async () => {
      const data = await getQuoteData(ticker);
      setQuoteData(data);
      dispatch("ADD_STOCK", {
        ticker,
        data
      });
    };
    func();
  }, [ticker]);

  const addToWatchList = async () => {
    if (!isAuth) return redirectLogin();
    await axios.patch(
      "watchlist",
      { symbol: ticker },
      createHTTPHeaders(token)
    );
  };

  const redirectLogin = () => {
    history.push("/login");
  };
  return (
    <div className={classes.Container}>
      <p>{ticker}</p>
      <p className={classes.Price}>{quoteData.priceClose}</p>
      <p className={classes.Date}>{quoteData.date}</p>
      <Button btnType="Info" className={{ backgroundColor: "none" }}>
        Buy
      </Button>
      <Button btnType="Info">Sell</Button>
      <Button btnType="Info" clicked={addToWatchList}>
        Add to Favorites
      </Button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== undefined,
    token: state.auth.token,
  };
};
export default connect(mapStateToProps)(withRouter(SecurityInfo));
