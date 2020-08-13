import React, { useEffect } from "react";
import Option from "../utility/Option";
import { BlackScholes } from "../utility";
import { useSelector } from "react-redux";
import moment from "moment";

const Contract = (props) => {
  const { removeContract, data, updateContract, currentPrice } = props;
  const stockData = useSelector((state) => state.stockData);

  const dateDiff = -moment().diff(data.date, "years", true);

  // Calculate the price based on Black-Scholes model
  const price = BlackScholes(
    data.type,
    +stockData.currentPrice,
    +data.strike,
    dateDiff,
    +stockData.interest,
    +stockData.volatility
  ).toFixed(2);

  // Update the price every time it changes
  useEffect(() => {
    updateContract(data.contractName, "price", price);
  }, [price]);

  return (
    <tr>
      <td>
        <select
          id="direction"
          className="form-control"
          onChange={(e) =>
            updateContract(data.contractName, "direction", e.target.value)
          }
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          placeholder="Amount"
          className="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "amount", e.target.value)
          }
          value={data.amount}
        />
      </td>
      <td>
        <select
          className="form-control"
          onChange={(e) =>
            updateContract(data.contractName, "type", e.target.value)
          }
        >
          <option>Call</option>
          <option>Put</option>
          <option>Cash</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          placeholder="Strike"
          className="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "strike", e.target.value)
          }
          value={data.strike}
        />
      </td>
      <td>
        <input
          type="date"
          placeholder="Expiry"
          className="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "date", e.target.value)
          }
          value={data.date}
        />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {console.log(data.type, +currentPrice, +data.strike)}
        <b>{price}</b>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <b>1.00</b>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <button
          type="button"
          aria-label="Left Align"
          className="btn btn-danger btn-s"
          onClick={() => removeContract(data.contractName)}
        >
          <span aria-hidden="true">Remove</span>
        </button>
      </td>
    </tr>
  );
};

const DUMMY_DATA = [1, 2, 3, 4];

const Panel = (props) => {
  const { portfolio, setPortfolio, visualize, currentPrice } = props;

  const addOption = () => {
    const newPortfolio = { ...portfolio };
    const id = new Date().toISOString();
    newPortfolio[id] = new Option(id);
    setPortfolio(newPortfolio);
  };

  const renderContracts = () => {
    const result = [];
    for (let id in portfolio) {
      result.push(
        <Contract
          removeContract={removeContract}
          updateContract={updateContract}
          currentPrice={currentPrice}
          data={portfolio[id]}
          key={id}
        />
      );
    }
    return result;
  };

  const updateContract = (id, property, value) => {
    const newPortfolio = { ...portfolio };
    newPortfolio[id][property] = value;
    setPortfolio(newPortfolio);
  };

  const removeContract = (id) => {
    const newPortfolio = { ...portfolio };
    delete newPortfolio[id];
    setPortfolio(newPortfolio);
  };

  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Panel</div>
      <div className="panel-body">
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Direction</th>
              <th>Amount</th>
              <th>Kind</th>
              <th>Strike</th>
              <th>Expiry</th>
              <th>Price</th>
              <th>
                <button
                  type="submit"
                  className="btn btn-success btn-xs"
                  onClick={addOption}
                >
                  Add Leg
                </button>
              </th>
            </tr>
          </thead>
          <tbody>{renderContracts()}</tbody>
        </table>
        <div className="pull-right">
          <button
            type="submit"
            className="btn btn-success btn-xs"
            onClick={visualize}
          >
            Generate Payoff
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
