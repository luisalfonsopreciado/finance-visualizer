import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import symbols from "../symbols.json";

const Search = (props) => {
  return (
    <>
      <Autocomplete
        id="combo-box-demo"
        options={symbols}
        getOptionLabel={(option) => option.displaySymbol}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
      />
    </>
  );
};

export default Search;
