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

export default function SimpleTable() {
  const classes = useStyles();
  const { portfolio, stockData } = useSelector((state) => state.portfolio);
  const keys = Object.keys(portfolio);

  const portfolioStats = {
    amount: 0,
    IV: 0,
    delta: 0,
    gamma: 0,
    rho: 0,
    theta: 0,
    vega: 0,
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Position</TableCell>
            <TableCell>Amount</TableCell>
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
            console.log(
              stockData.currentPrice,
              contract.strike,
              util.dateDiffInYears(contract.date),
              stockData.volatility / 100,
              stockData.interest / 100,
              contract
            );

            console.log(contract)

            // Calculate greeks
            const contractDelta =
              contract.amount *
              greeks.getDelta(
                stockData.currentPrice,
                contract.strike,
                util.dateDiffInYears(contract.date),
                stockData.volatility / 100,
                stockData.interest / 100,
                contract
              ) *
              100;

            const contractGamma =
              contract.amount *
              greeks.getGamma(
                stockData.currentPrice,
                contract.strike,
                util.dateDiffInYears(contract.date),
                stockData.volatility / 100,
                stockData.interest / 100,
                contract
              ) *
              100;

            const contractRho =
              contract.amount *
              greeks.getRho(
                stockData.currentPrice,
                contract.strike,
                util.dateDiffInYears(contract.date),
                stockData.volatility / 100,
                stockData.interest / 100,
                contract
              ) *
              100;

            const contractTheta =
              contract.amount *
              greeks.getTheta(
                stockData.currentPrice,
                contract.strike,
                util.dateDiffInYears(contract.date),
                stockData.volatility / 100,
                stockData.interest / 100,
                contract
              ) *
              100;

            const contractVega =
              contract.amount *
              greeks.getVega(
                stockData.currentPrice,
                contract.strike,
                util.dateDiffInYears(contract.date),
                stockData.volatility / 100,
                stockData.interest / 100,
                contract
              ) *
              100;

            // Add greeks to portfolio total
            portfolioStats.IV += stockData.interest;
            portfolioStats.amount += contract.amount;
            portfolioStats.delta += contractDelta;
            portfolioStats.gamma += contractGamma;
            portfolioStats.rho += contractRho;
            portfolioStats.theta += contractTheta;
            portfolioStats.vega += contractVega;

            return (
              <TableRow key={key}>
                {/* Position */}
                <TableCell component="th" scope="row">
                  {contract.direction +
                    " " +
                    contract.type +
                    "  " +
                    stockData.currentPrice}
                </TableCell>
                {/* Amount */}
                <TableCell component="th" scope="row">
                  {contract.amount}
                </TableCell>
                {/* Interest Rate */}
                <TableCell align="right">{stockData.interest + "%"}</TableCell>
                {/* Delta*/}
                <TableCell align="right">{contractDelta.toFixed(1)}</TableCell>
                {/* Gamma */}
                <TableCell align="right">{contractGamma.toFixed(1)}</TableCell>
                {/* Rho*/}
                <TableCell align="right">{contractRho.toFixed(1)}</TableCell>
                {/* Theta */}
                <TableCell align="right">{contractTheta.toFixed(1)}</TableCell>
                {/* Vega */}
                <TableCell align="right">{contractVega.toFixed(1)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow key="Total">
            {/* Position */}
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            {/* Amount */}
            <TableCell component="th" scope="row">
              {portfolioStats.amount}
            </TableCell>
            {/* Interest Rate */}
            <TableCell align="right">{stockData.interest + "%"}</TableCell>
            {/* Delta*/}
            <TableCell align="right">{portfolioStats.delta.toFixed(1)}</TableCell>
            {/* Gamma */}
            <TableCell align="right">{portfolioStats.gamma.toFixed(1)}</TableCell>
            {/* Rho*/}
            <TableCell align="right">{portfolioStats.rho.toFixed(1)}</TableCell>
            {/* Theta */}
            <TableCell align="right">{portfolioStats.theta.toFixed(1)}</TableCell>
            {/* Vega */}
            <TableCell align="right">{portfolioStats.vega.toFixed(1)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
