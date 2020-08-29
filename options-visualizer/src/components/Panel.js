import React, { useEffect, useState, useCallback } from "react";
import Option from "../utility/Option";
import { BlackScholes, SELL } from "../utility";
import { useSelector, useDispatch } from "react-redux";
import * as util from "../utility";
import useUpdateEffect from "../hooks/useUpdateEffect";
import * as portfolioActions from "../store/actions/portfolio";

// TODO: make contract component lean by outsorcing logic to redux
const Contract = (props) => {
  const { data, optionData } = props;
  const { updateContract } = props;

  /*
   If optionData is defined then the strike prices must adjust to the
   Expiration date
   */

  // Default state values are when a strategy is selected in live mode
  const [expirationDates, setExpirationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(data.date);
  const [strikePrices, setStrikePrices] = useState([[data.strike]]);

  const dispatch = useDispatch();

  // Stock data from redux
  const stockData = useSelector((state) => state.stockData);

  // Calculate dateDifference in years, used in theoretical black scholes
  const dateDiff = util.dateDiffInYears(data.date);

  // Calculate the price based on Black-Scholes model
  const [price, setPrice] = useState(data.price);

  // Update the price every time it changes
  useUpdateEffect(() => {
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
  useUpdateEffect(() => {
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
        (item) => +item.strike === +data.strike
      );

      // Set the price depending if we are short or long
      if (data.direction === "Buy") {
        setPrice(contract.ask);
      } else {
        setPrice(contract.bid);
      }
    }

  }, [data.strike, setPrice]);

  useUpdateEffect(() => {
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

      updateContract(data.contractName, "date", selectedDate);
    }
  }, [selectedDate]);

  // Update type
  useUpdateEffect(() => {
    // updateContract(data.contractName, "type", data.type);

    // If we just changed to cash
    if (data.type === util.CASH) {
      // Set Debit/Credit equal to the stock price
      setPrice(stockData.currentPrice);
    }
  }, [data.type]);

  const cashContract = data.type === util.CASH;

  return (
    <tr>
      {/* Direction: Fully Using Redux */}
      <td>
        <select
          id="direction"
          className="form-control"
          value={data.direction}
          onChange={(e) =>
            dispatch(
              portfolioActions.updateDirection(
                data.contractName,
                e.target.value,
                stockData
              )
            )
          }
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </td>
      {/* Amount: Fully Using Redux */}
      <td>
        <input
          type="number"
          placeholder="Amount"
          className="form-control form-control-inline"
          onChange={(e) =>
            dispatch(
              portfolioActions.updateAmount(
                data.contractName,
                e.target.value,
                stockData
              )
            )
          }
          value={data.amount}
        />
      </td>
      {/* Kind: Fully Using Redux*/}
      <td>
        <select
          className="form-control"
          onChange={(e) =>
            dispatch(
              portfolioActions.updateKind(
                data.contractName,
                e.target.value,
                stockData
              )
            )
          }
          value={data.type}
        >
          <option>Call</option>
          <option>Put</option>
          <option>Cash</option>
        </select>
      </td>
      {/* Strike Price: TODO UPDATE REDUX */}
      <td>
        {!cashContract ? (
          optionData ? (
            <div class="form-group">
              <select
                class="form-control"
                id="exampleFormControlSelect1"
                onChange={(e) =>
                  dispatch(
                    portfolioActions.updateStrike(
                      data.contractName,
                      e.target.value,
                      stockData
                    )
                  )
                }
                value={data.strike}
              >
                {strikePrices.map((price) => (
                  <option>{isNaN(price) ? null : price}</option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type="number"
              placeholder="Strike"
              className="form-control form-control-inline"
              onChange={(e) =>
                dispatch(
                  portfolioActions.updateStrike(
                    data.contractName,
                    e.target.value,
                    stockData
                  )
                )
              }
              value={data.strike}
            />
          )
        ) : null}
      </td>
      {/* Expiry Date */}
      <td>
        {!cashContract &&
          (!optionData ? (
            <input
              type="date"
              placeholder="Expiry"
              className="form-control form-control-inline"
              onChange={(e) =>
                dispatch(
                  portfolioActions.updateExpiry(
                    data.contractName,
                    e.target.value,
                    stockData
                  )
                )
              }
              value={data.date}
            />
          ) : (
            <div class="form-group">
              <select
                class="form-control"
                id="exampleFormControlSelect1"
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
              >
                {expirationDates.map((date) => (
                  <option>{date}</option>
                ))}
              </select>
            </div>
          ))}
      </td>
      {/* Premium/Price */}
      <td style={{ verticalAlign: "middle" }}>
        <b>{data.price * data.amount}</b>
      </td>
      {/* Debit/Credit: TODO add as property in Option Obj, updated in */}
      <td style={{ verticalAlign: "middle" }}>
        <b>{(data.direction === SELL ? price : -price) * data.amount} </b>
      </td>
      {/* Remove Button */}
      <td style={{ verticalAlign: "middle" }}>
        <button
          type="button"
          aria-label="Left Align"
          className="btn btn-danger btn-s"
          onClick={() =>
            dispatch(portfolioActions.removeContract(data.contractName))
          }
        >
          <span aria-hidden="true">Remove</span>
        </button>
      </td>
    </tr>
  );
};

const Panel = (props) => {
  const { optionData } = props; // removed portfolio
  const portfolio = useSelector((state) => state.portfolio);
  const stockData = useSelector((state) => state.stockData);
  const dispatch = useDispatch();

  const renderContracts = () => {
    const result = [];
    for (let id in portfolio) {
      result.push(
        <Contract optionData={optionData} data={portfolio[id]} key={id} />
      );
    }
    return result;
  };

  const calculateTotal = () => {
    let premium = 0;
    let debitcredit = 0;
    let amount = 0;

    for (let key in portfolio) {
      const contract = portfolio[key];
      premium += +contract.price * +contract.amount;
      const debitToAdd =
        contract.direction === SELL ? +contract.price : -+contract.price;
      debitcredit += debitToAdd * +contract.amount;
      amount += +contract.amount;
    }
    return {
      premium: premium.toFixed(2),
      debitcredit: debitcredit.toFixed(2),
      amount,
    };
  };

  const { premium, debitcredit, amount } = calculateTotal();

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
              <th>Premium</th>
              <th>Debit/Credit</th>
              <th>
                <button
                  type="submit"
                  className="btn btn-success btn-s"
                  onClick={() =>
                    dispatch(
                      portfolioActions.addContract(new Option(), stockData)
                    )
                  }
                >
                  Add Leg
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {renderContracts()}
            <tr>
              <td>
                <b>Total</b>
              </td>
              <td>
                <b>{amount}</b>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>{premium}</b>
              </td>
              <td>
                <b>{debitcredit}</b>
              </td>
              <td>
                <button
                  type="button"
                  aria-label="Left Align"
                  className="btn btn-danger btn-s"
                  onClick={() => dispatch(portfolioActions.resetPortfolio())}
                >
                  <span aria-hidden="true">Remove All</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Panel;
