import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import * as greeks from "../utility/greeks";
import * as util from "../utility/constants";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function SimpleTable() {
  const classes = useStyles();
  const { portfolio, stockData } = useSelector((state) => state.portfolio);
  const keys = Object.keys(portfolio);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell align="right">IV</TableCell>
            <TableCell align="right">Delta</TableCell>
            <TableCell align="right">Gamma</TableCell>
            <TableCell align="right">Rho</TableCell>
            <TableCell align="right">Theta</TableCell>
            <TableCell align="right">Vega</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => {
            const contract = portfolio[key];

            return (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {contract.direction +
                    " " +
                    contract.type +
                    "  " +
                    stockData.currentPrice}
                </TableCell>
                <TableCell align="right">{stockData.interest + "%"}</TableCell>
                <TableCell align="right">
                  {greeks
                    .getDelta(
                      stockData.currentPrice,
                      contract.price,
                      util.dateDiffInYears(contract.date),
                      stockData.volatility / 100,
                      stockData.interest / 100,
                      contract.TYPE
                    )
                    .toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {greeks
                    .getGamma(
                      stockData.currentPrice,
                      contract.price,
                      util.dateDiffInYears(contract.date),
                      stockData.volatility / 100,
                      stockData.interest / 100,
                      contract.TYPE
                    )
                    .toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {greeks
                    .getRho(
                      stockData.currentPrice,
                      contract.price,
                      util.dateDiffInYears(contract.date),
                      stockData.volatility / 100,
                      stockData.interest / 100,
                      contract.TYPE
                    )
                    .toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {greeks
                    .getTheta(
                      stockData.currentPrice,
                      contract.price,
                      util.dateDiffInYears(contract.date),
                      stockData.volatility / 100,
                      stockData.interest / 100,
                      contract.TYPE
                    )
                    .toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {greeks
                    .getVega(
                      stockData.currentPrice,
                      contract.price,
                      util.dateDiffInYears(contract.date),
                      stockData.volatility / 100,
                      stockData.interest / 100,
                      contract.TYPE
                    )
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
