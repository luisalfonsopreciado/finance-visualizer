import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { liveDataContext } from "../../context/liveData";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import DropDownBtn from "./DropDownBtn";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions/stockData";

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
  navbar: {
    marginBottom: "40px",
    position: "relative",
    zIndex: "10",
  },
}));

export default function MenuAppBar({ setPortfolio, optionData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { liveMode, setLiveMode } = useContext(liveDataContext);

  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar>
        <Typography variant="h3" className={classes.title}>
          Option Strategy Builder
        </Typography>
        <DropDownBtn setPortfolio={setPortfolio} optionData={optionData}/>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={liveMode}
                onChange={() =>
                  setLiveMode((prev) => {
                    if (prev === true) dispatch(actions.resetData());
                    return !prev;
                  })
                }
                aria-label="live mode switch"
              />
            }
            label={"Live Data Mode"}
          />
        </FormGroup>
      </Toolbar>
    </AppBar>
  );
}
