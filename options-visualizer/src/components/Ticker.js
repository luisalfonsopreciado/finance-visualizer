import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { getTickerSymbols } from "../../../shared/functions";
import Input from "../../UI/Input/Input";

const TickerOptions = ({
  ticker: { elementType, valid, validation, value, touched, label },
  match: { path },
  inputChangedHandler,
}) => {
  const [instrumentArray, setInstrumentArray] = useState([]);

  useEffect(
    (instrumentArray) => {
      const tickersArray = getTickerSymbols(path.slice(1));
      tickersArray.then((ticker) => setInstrumentArray(ticker));
    },
    [path]
  );

  const elementConfig = {
    options: instrumentArray,
  };

  let input = null;
  if (instrumentArray.length > 0) {
    input = (
      <Input
        key="ticker"
        elementType={elementType}
        elementConfig={elementConfig}
        invalid={valid}
        shouldValidate={validation}
        value={value}
        touched={touched}
        label={label}
        changed={(event) => inputChangedHandler(event, "ticker")}
      />
    );
  }
  return <React.Fragment>{input}</React.Fragment>;
};

export default TickerOptions;
