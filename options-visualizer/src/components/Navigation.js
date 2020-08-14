import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { liveDataContext } from "../context/liveData";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const { liveMode, setLiveMode } = useContext(liveDataContext);

  return (
    <div className={classes.root}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={liveMode}
              onChange={() => setLiveMode((prev) => !prev)}
              aria-label="live mode switch"
            />
          }
          label={"Live Data Mode"}
        />
      </FormGroup>
    </div>
  );
}
