import React from "react";
import { Snackbar, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const Error = (props) => {

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.removeFunc();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={true}
      autoHideDuration={6000}
      onClose={handleClose}
      message={props.children}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};
export default Error;
