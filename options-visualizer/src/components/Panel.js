import React, { useEffect, useState } from "react";
import Option from "../utility/Option";
import { useSelector, useDispatch } from "react-redux";
import * as util from "../utility";
import useUpdateEffect from "../hooks/useUpdateEffect";
import * as actions from "../store/actions/portfolio";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { Table, TableCell, TableContainer } from "@material-ui/core";
import { TableRow, TableHead } from "@material-ui/core";
// TODO: make contract component lean by outsorcing logic to redux
const Contract = (props) => {
  const { data, optionData } = props;

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
  const { stockData } = useSelector((state) => state.portfolio);

  // Calculate the price based on Black-Scholes model
  const [price, setPrice] = useState(data.price);

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
        dispatch(
          actions.updateContract(data.contractName, "price", contract.ask)
        );
      } else {
        dispatch(
          actions.updateContract(data.contractName, "price", contract.bid)
        );
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
    }
  }, [selectedDate]);

  // Update type
  useUpdateEffect(() => {
    // If we just changed to cash
    if (data.type === util.CASH) {
      // Set Debit/Credit equal to the stock price
      setPrice(stockData.currentPrice);
    }
  }, [data.type]);

  const cashContract = data.type === util.CASH;

  return (
    <TableRow>
      {/* Direction: Fully Using Redux */}
      <TableCell>
        <select
          id="direction"
          className="form-control"
          value={data.direction}
          onChange={(e) =>
            dispatch(
              actions.updateContract(
                data.contractName,
                "direction",
                e.target.value
              )
            )
          }
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </TableCell>
      {/* Amount: Fully Using Redux */}
      <TableCell>
        <input
          type="number"
          placeholder="Amount"
          className="form-control form-control-inline"
          onChange={(e) =>
            dispatch(
              actions.updateContract(
                data.contractName,
                "amount",
                e.target.value
              )
            )
          }
          value={data.amount}
        />
      </TableCell>
      {/* Kind: Fully Using Redux*/}
      <TableCell>
        <select
          className="form-control"
          onChange={(e) =>
            dispatch(
              actions.updateContract(data.contractName, "type", e.target.value)
            )
          }
          value={data.type}
        >
          <option>Call</option>
          <option>Put</option>
          <option>Cash</option>
        </select>
      </TableCell>
      {/* Strike Price: TODO UPDATE REDUX */}
      <TableCell>
        {!cashContract ? (
          optionData ? (
            <div class="form-group">
              <select
                class="form-control"
                id="exampleFormControlSelect1"
                onChange={(e) =>
                  dispatch(
                    actions.updateContract(
                      data.contractName,
                      "strike",
                      e.target.value
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
                  actions.updateContract(
                    data.contractName,
                    "strike",
                    e.target.value
                  )
                )
              }
              value={data.strike}
            />
          )
        ) : null}
      </TableCell>
      {/* Expiry Date */}
      <TableCell>
        {!cashContract &&
          (!optionData ? (
            <input
              type="date"
              placeholder="Expiry"
              className="form-control form-control-inline"
              onChange={(e) =>
                dispatch(
                  actions.updateContract(
                    data.contractName,
                    "date",
                    e.target.value
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
      </TableCell>
      {/* Premium/Price */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <b>{data.price * data.amount}</b>
      </TableCell>
      {/* Debit/Credit: TODO add as property in Option Obj, updated in */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <b>{data.debitCredit * data.amount} </b>
      </TableCell>
      {/* Remove Button */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <button
          type="button"
          aria-label="Left Align"
          className="btn btn-danger btn-s"
          onClick={() => dispatch(actions.removeContract(data.contractName))}
        >
          <span aria-hidden="true">Remove</span>
        </button>
      </TableCell>
    </TableRow>
  );
};

const Panel = (props) => {
  const { optionData } = props; // removed portfolio
  const { portfolio, stockData } = useSelector((state) => state.portfolio);
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
        contract.direction === util.SELL ? +contract.price : -+contract.price;
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
    <Card variant="outlined">
      <CardHeader title="Option Portfolio" />
      <CardContent>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Direction</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Strike</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Debit/Credit</TableCell>
                <TableCell>
                  <button
                    type="submit"
                    className="btn btn-success btn-s"
                    onClick={() =>
                      dispatch(actions.addContract(new Option(), stockData))
                    }
                  >
                    Add Leg
                  </button>
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {renderContracts()}
              <TableRow>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell>
                  <b>{amount}</b>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <b>{premium}</b>
                </TableCell>
                <TableCell>
                  <b>{debitcredit}</b>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    aria-label="Left Align"
                    className="btn btn-danger btn-s"
                    onClick={() => dispatch(actions.resetPortfolio())}
                  >
                    <span aria-hidden="true">Remove All</span>
                  </button>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Panel;
