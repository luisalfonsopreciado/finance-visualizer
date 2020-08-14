import React from "react";
import { FormControl } from "react-bootstrap";

const Search = (props) => {
  const { query, setQuery } = props;

  return (
    <FormControl
      {...props}
      value={query}
      onChange={(evt) => setQuery(evt.target.value)}
    />
  );
};

export default Search;
