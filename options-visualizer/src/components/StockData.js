import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions/portfolio";
import {
  Card,
  CardContent,
  TextField,
  InputLabel,
  CardHeader,
} from "@material-ui/core";
import moment from "moment";

const StockData = ({ liveMode }) => {
  const { stockData } = useSelector((state) => state.portfolio);
  const dispatch = useDispatch();

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title="Stock Data"
          subheader={moment().format("MM-DD-YYYY")}
        ></CardHeader>
        <CardContent>
          <InputLabel htmlFor="current-price">
            Current Stock Price ($)
          </InputLabel>
          <TextField
            id="current-price"
            label="Current Price"
            variant="filled"
            type="number"
            placeholder="Current Price"
            onChange={(e) => {
              dispatch(actions.updateStockData("currentPrice", e.target.value));
            }}
            value={stockData.currentPrice}
          ></TextField>
          <InputLabel htmlFor="current-price">Volatility (%)</InputLabel>
          <TextField
            id="outlined-basic"
            label="Volatility"
            variant="filled"
            type="number"
            placeholder="Volatility"
            onChange={(e) =>
              dispatch(actions.updateStockData("volatility", e.target.value))
            }
            value={stockData.volatility}
          ></TextField>
          <InputLabel htmlFor="current-price">Interest Rate(%)</InputLabel>
          <TextField
            id="outlined-basic"
            label="Interest"
            variant="filled"
            type="number"
            placeholder="Interest"
            onChange={(e) =>
              dispatch(actions.updateStockData("interest", e.target.value))
            }
            value={stockData.volatility}
          ></TextField>
        </CardContent>
      </Card>
    </>
  );
};

export default StockData;
