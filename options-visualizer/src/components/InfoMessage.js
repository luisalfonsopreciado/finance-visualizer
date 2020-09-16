import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector } from "react-redux";
import useUpdateEffect from "../hooks/useUpdateEffect";

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

export default function ConsecutiveSnackbars() {
  const info = useSelector((state) => state.strategyInfo);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(info.info);

  useUpdateEffect(() => {
    setMessageInfo(info.info);
    setOpen(true);
  }, [info.info]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const classes = useStyles();

  return (
    <div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        onClose={handleClose}
        onExited={handleExited}
        message={messageInfo}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
