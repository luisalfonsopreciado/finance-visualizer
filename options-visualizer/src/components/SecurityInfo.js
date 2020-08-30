import React from "react";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import moment from "moment";

const SecurityInfo = () => {
  const { stockData } = useSelector((state) => state.portfolio);

  return (
    <Card>
      <Card.Body>
        <h1 class="display-4">{stockData.ticker}</h1>
        <p class="lead">Quote: {stockData.currentPrice}</p>
        <p>{moment(new Date()).format("YYYY-MM-DD")}</p>.
      </Card.Body>
    </Card>
  );
};

export default SecurityInfo;
