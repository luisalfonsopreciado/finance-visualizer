import React, { useEffect, useState } from "react";
import Option from "../utility/Option";
import { BlackScholes } from "../utility";
import { useSelector } from "react-redux";
import moment from "moment";

const Contract = (props) => {
  const { removeContract, data, optionData } = props;
  const { updateContract } = props;

  /*
   If optionData is defined then the strike prices must adjust to the
   Expiration date
   */
  const [expirationDates, setExpirationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [strikePrices, setStrikePrices] = useState([
    "Please Select Expiration Date",
  ]);
  const [selectedStrike, setSelectedStrike] = useState();

  // Stock data from redux
  const stockData = useSelector((state) => state.stockData);

  // Calculate dateDifference in years, used in theoretical black scholes
  const dateDiff = -moment().diff(data.date, "years", true);

  // Calculate the price based on Black-Scholes model

  const [price, setPrice] = useState();

  // Update the current price every time something changes
  useEffect(() => {
    if (optionData) {
    } else {
      setPrice(
        BlackScholes(
          data.type,
          +stockData.currentPrice,
          +data.strike,
          dateDiff,
          +stockData.interest,
          +stockData.volatility
        ).toFixed(2)
      );
    }
  });

  // Update the price every time it changes
  useEffect(() => {
    updateContract(data.contractName, "price", price);
  }, [price]);

  // Set expiration Dates when component mounts
  useEffect(() => {
    if (optionData) {
      const expirationDates = optionData.data.map(
        (item) => item.expirationDate
      );
      setExpirationDates(expirationDates);
    }
  }, []);

  // Update strike and price at change
  useEffect(() => {
    if (optionData) {
      // Find the element with same date
      const apiContract = optionData.data.find(
        (item) => item.expirationDate === selectedDate
      );

      if (!apiContract) return;

      // Find the type of option this is
      const type = data.type.toUpperCase();

      // Extract the contracts given the date
      const contractsAtDate = apiContract.options[type];

      // Find the contract with the selected Strike
      const contract = contractsAtDate.find(
        (item) => +item.strike === +selectedStrike
      );

      // Set the price depending if we are short or long
      if (data.direction === "Buy") {
        setPrice(contract.ask);
      } else {
        setPrice(contract.bid);
      }
    }

    updateContract(data.contractName, "strike", selectedStrike);
  }, [selectedStrike, setPrice]);

  useEffect(() => {
    if (optionData) {
      // Find the element with same date
      const apiContract = optionData.data.find(
        (item) => item.expirationDate === selectedDate
      );

      // If none found return
      if (!apiContract) return;

      // Find the type of option this is
      const type = data.type.toUpperCase();

      // Extract the contracts given the date
      const contractsAtDate = apiContract.options[type];

      // Make an array of strikes at the current date
      const strikesAtDate = contractsAtDate.map((item) => item.strike);

      // Update strikeprices
      setStrikePrices(strikesAtDate);
    }

    updateContract(data.contractName, "date", selectedDate);
  }, [selectedDate]);

  return (
    <tr>
      {/* Direction */}
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
      {/* Amount */}
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
      {/* Kind */}
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
      {/* Strike Price */}
      <td>
        {optionData ? (
          <div class="form-group">
            <select
              class="form-control"
              id="exampleFormControlSelect1"
              onChange={(e) => setSelectedStrike(e.target.value)}
            >
              {strikePrices.map((price) => (
                <option>{price}</option>
              ))}
            </select>
          </div>
        ) : (
          <input
            type="number"
            placeholder="Strike"
            className="form-control form-control-inline"
            onChange={(e) =>
              updateContract(data.contractName, "strike", e.target.value)
            }
            value={data.strike}
          />
        )}
      </td>
      {/* Expiry Date */}
      <td>
        {!optionData ? (
          <input
            type="date"
            placeholder="Expiry"
            className="form-control form-control-inline"
            onChange={(e) =>
              updateContract(data.contractName, "date", e.target.value)
            }
            value={data.date ? data.date : ""}
          />
        ) : (
          <div class="form-group">
            <select
              class="form-control"
              id="exampleFormControlSelect1"
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {expirationDates.map((date) => (
                <option>{date}</option>
              ))}
            </select>
          </div>
        )}
      </td>
      {/* Contract Price */}
      <td style={{ verticalAlign: "middle" }}>
        <b>{price}</b>
      </td>
      {/* Remove Button */}
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

const Panel = (props) => {
  const { portfolio, setPortfolio, visualize, optionData } = props;

  const addContract = () => {
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
          optionData={optionData}
          removeContract={removeContract}
          updateContract={updateContract}
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

  console.log("Panel Rendered")

  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Option Portfolio</div>
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
                  className="btn btn-success btn-s"
                  onClick={addContract}
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
            className="btn btn-success btn-s"
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
