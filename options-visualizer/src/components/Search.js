import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import symbols from "../symbols.json";

const Search = (props) => {
  const [inputValue, setInputValue] = useState("");

  const filterOptions = (options, state) => {
    // Extract the inputValue
    const query = state.inputValue;
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
      <Autocomplete
        id="combo-box-demo"
        options={symbols}
        getOptionLabel={(option) => option.displaySymbol}
        filterOptions={(options, state) => filterOptions(options, state)}
        renderInput={(params) => (
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
        noOptionsText={
          inputValue.length <= 1 ? "Type a Ticker Symbol" : "No Symbols Found"
        }
      />
    </>
  );
};

export default Search;
