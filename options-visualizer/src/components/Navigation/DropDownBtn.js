import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import * as util from "../../utility";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const DropDownBtn = ({ setPortfolio }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event, newPortfolio) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    newPortfolio && setPortfolio(newPortfolio);
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        View Sample Strategies
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    onClick={(e) => handleClose(e, util.bullCallSpread)}
                  >
                    Bull Call Spread
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.bearPutSpread)}>
                    Bear Put Spread
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.longStraddle)}>
                    Long Straddle
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.shortStraddle)}>
                    Short Straddle
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.longButterfly)}>
                    Long Butterfly
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.shortButterfly)}>
                    Short Butterfly
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.longCondor)}>
                    Long Condor
                  </MenuItem>
                  <MenuItem onClick={(e) => handleClose(e, util.shortCondor)}>
                    Short Condor
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
export default DropDownBtn;
