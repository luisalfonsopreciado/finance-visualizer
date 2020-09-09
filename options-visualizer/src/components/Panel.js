import React, { useEffect, useState } from "react";
import Option from "../utility/Option";
import { useSelector, useDispatch } from "react-redux";
import * as util from "../utility";
import useUpdateEffect from "../hooks/useUpdateEffect";
import * as actions from "../store/actions/portfolio";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Table, TableCell, TableContainer } from "@material-ui/core";
import { TableRow, TableHead, makeStyles } from "@material-ui/core";
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { MenuItem, TextField, TableBody, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// TODO: make contract component lean by outsorcing logic to redux
const Contract = (props) => {
  const { data, optionData } = props;
  const classes = useStyles();

  /*
   If optionData is defined then the strike prices must adjust to the
   Expiration date
   */

  // Default state values are when a strategy is selected in live mode
  const [expirationDates, setExpirationDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(data.date);
  const [strikePrices, setStrikePrices] = useState([[data.strike]]);

  const dispatch = useDispatch();

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
  }, [data.strike]);

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

  const cashContract = data.type === util.CASH;

  return (
    <TableRow>
      {/* Direction: Fully Using Redux */}
      <TableCell>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            Direction
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
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
            label="Direction"
          >
            <MenuItem value={util.BUY}>Buy</MenuItem>
            <MenuItem value={util.SELL}>Sell</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      {/* Amount: Fully Using Redux */}
      <TableCell>
        <TextField
          id="outlined-number"
          label="Amount"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
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
          variant="outlined"
        />
      </TableCell>
      {/* Kind: Fully Using Redux*/}
      <TableCell>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Kind</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={data.type}
            onChange={(e) =>
              dispatch(
                actions.updateContract(
                  data.contractName,
                  "type",
                  e.target.value
                )
              )
            }
            label="Kind"
          >
            <MenuItem value={util.CALL}>Call</MenuItem>
            <MenuItem value={util.PUT}>Put</MenuItem>
            <MenuItem value={util.CASH}>Cash</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      {/* Strike Price: TODO UPDATE REDUX */}
      <TableCell>
        {!cashContract ? (
          optionData ? (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Strike
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={data.strike}
                onChange={(e) =>
                  dispatch(
                    actions.updateContract(
                      data.contractName,
                      "strike",
                      e.target.value
                    )
                  )
                }
                label="Kind"
              >
                {strikePrices.map((price) => (
                  <MenuItem value={price}>
                    {isNaN(price) ? null : price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              id="outlined-number"
              label="Strike"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
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
              variant="outlined"
            />
          )
        ) : null}
      </TableCell>
      {/* Expiry Date */}
      <TableCell>
        {!cashContract &&
          (!optionData ? (
            <TextField
              id="date"
              label="Expiry"
              type="date"
              value={data.date}
              className={classes.textField}
              onChange={(e) =>
                dispatch(
                  actions.updateContract(
                    data.contractName,
                    "date",
                    e.target.value
                  )
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Expiry
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
                label="Expiry"
              >
                {expirationDates.map((date) => (
                  <MenuItem value={date}>{date}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
      </TableCell>
      {/* Premium/Price */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <Typography variant="h6">
          <b>{data.price * data.amount}</b>
        </Typography>
      </TableCell>
      {/* Debit/Credit: TODO add as property in Option Obj, updated in */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <Typography variant="h6">
          <b>{data.debitCredit * data.amount} </b>
        </Typography>
      </TableCell>
      {/* Remove Button */}
      <TableCell style={{ verticalAlign: "middle" }}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={() => dispatch(actions.removeContract(data.contractName))}
        >
          Remove
        </Button>
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
      <CardContent>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">Direction</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Amount</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Kind</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Strike</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Expiry</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Premium</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">Debit/Credit</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      dispatch(actions.addContract(new Option(), stockData))
                    }
                  >
                    Add Leg
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderContracts()}
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Total</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{amount}</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Typography variant="h6">{premium}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{debitcredit}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => dispatch(actions.resetPortfolio())}
                  >
                    Remove All
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Panel;
