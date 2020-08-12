import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as stockActions from "../store/actions/stockData";

const StockData = (props) => {
  const stockData = useSelector((state) => state.stockData);
  const dispatch = useDispatch();

  console.log(stockData);

  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Underlying stock</div>

      <select id="direction" className="form-control">
        {/* {data.tickers.map((ticker) => (
          <option key={ticker.value}>{ticker.value}</option>
        ))} */}
      </select>

      <div className="panel-body">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-5 control-label">Current price</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="CurrentPrice"
                className="form-control"
                value={stockData.currentPrice}
                onChange={(e) =>
                  dispatch(stockActions.updatePrice(e.target.value))
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 control-label">Volatility</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="Volatility"
                className="form-control"
                onChange={(e) =>
                  dispatch(stockActions.updateVolatility(e.target.value))
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 control-label">Interest Rate</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="Interest Rate"
                className="form-control"
                onChange={(e) =>
                  dispatch(stockActions.updateInterest(e.target.value))
                }
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockData;
