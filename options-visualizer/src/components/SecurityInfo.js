import React from "react";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import moment from "moment";
import { Typography } from "@material-ui/core";

const SecurityInfo = () => {
  const { stockData } = useSelector((state) => state.portfolio);

  return (
    <Card variant="outlined">
      <Card.Body>
        <Typography variant="h1">{stockData.ticker}</Typography>
        <Typography variant="h5">Quote: {stockData.currentPrice}$</Typography>
        <Typography variant="h6">{moment(new Date()).format("YYYY-MM-DD")}</Typography>
      </Card.Body>
    </Card>
  );
};

export default SecurityInfo;
