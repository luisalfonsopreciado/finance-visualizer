import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import symbols from "../symbols.json";
import { Button } from "@material-ui/core";
import {  Col, Row } from "react-bootstrap";
import { makeStyles, Container } from "@material-ui/core";

const useStyles = makeStyles({
  item: {
    // No Effect
    height: "100%",
    widht: "100%",
  },
});

const Search = ({ searchFunc }) => {
  const [inputValue, setInputValue] = useState("");
  const classes = useStyles();

  const filterOptions = (options, state) => {
    // Extract the inputValue
    const query = state.inputValue.toUpperCase();
    // Update state
    setInputValue(query);
    // If short query return nothing (improves performance)
    if (query.length <= 1) return [];

    // Filter out the options
    return options.filter((o) => o.displaySymbol.includes(query));
  };

  return (
    <>
      {/* A Warning message is outputed in console: Fix later */}
      <Container>
        <Row>
          <Col md={10}>
            <Autocomplete
              id="combo-box-demo"
              color="primary"
              options={symbols}
              getOptionLabel={(option) =>
                option.displaySymbol + ": " + option.description
              }
              filterOptions={(options, state) => filterOptions(options, state)}
              className={classes.item}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Ticker"
                  variant="outlined"
                  color="primary"
                />
              )}
              noOptionsText={
                inputValue.length <= 1
                  ? "Type a Ticker Symbol"
                  : "No Symbols Found"
              }
            />
          </Col>
          <Col md={2}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => searchFunc(inputValue)}
              className={classes.item}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Search;
