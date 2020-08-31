import React from "react";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Error = (props) => {
  return (
    <Alert severity="error" onClick={props.removeFunc}>
      {props.children}
    </Alert>
  );
};
export default Error;
