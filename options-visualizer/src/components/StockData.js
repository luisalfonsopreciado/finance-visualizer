import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as stockActions from "../store/actions/portfolio";
import * as portfolioActions from "../store/actions/portfolio";

const StockData = ({ liveMode }) => {
  const { stockData } = useSelector((state) => state.portfolio);
  const dispatch = useDispatch();

  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Underlying stock</div>
      <div className="panel-body">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-5 control-label">Current price ($)</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="CurrentPrice"
                className="form-control"
                value={stockData.currentPrice}
                disabled={liveMode}
                onChange={(e) => {
                  dispatch(stockActions.updatePrice(e.target.value));
                  dispatch(
                    portfolioActions.updatePrices({
                      ...stockData,
                      price: e.target.value,
                    })
                  );
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 control-label">Volatility (%)</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="Volatility"
                className="form-control"
                value={stockData.volatility}
                onChange={(e) =>
                  dispatch(stockActions.updateVolatility(e.target.value))
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 control-label">Interest Rate (%)</label>
            <div className="col-sm-7">
              <input
                type="number"
                placeholder="Interest Rate"
                className="form-control"
                value={stockData.interest}
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
