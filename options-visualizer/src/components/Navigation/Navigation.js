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
import * as actions from "../../store/actions/portfolio";
import GitHubIcon from "@material-ui/icons/GitHub";
import { IconButton } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";

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

export default function MenuAppBar({
  setPortfolio,
  optionData,
  changeTheme,
  theme,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { liveMode, setLiveMode } = useContext(liveDataContext);

  return (
    <AppBar position="static" className={classes.navbar}>
      <Toolbar>
        <Typography variant="h3" className={classes.title}>
          Option Strategy Builder
        </Typography>

        <div onClick={changeTheme}>
          {theme === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
        </div>
        <DropDownBtn setPortfolio={setPortfolio} optionData={optionData} />
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
        <IconButton
          aria-label="delete"
          color="secondary"
          href="https://github.com/luisalfonsopreciado/finance-visualizer"
          target="_blank"
        >
          <GitHubIcon color="action" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
