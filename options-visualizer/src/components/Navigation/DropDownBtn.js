import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import * as util from "../../utility";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions/portfolio";
import * as strategyActions from "../../store/actions/strategy-info";

const DropDownBtn = ({ optionData }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { stockData } = useSelector((state) => state.portfolio);
  const { currentPrice, volatility, interest } = stockData;
  const dispatch = useDispatch();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event, newPortfolio, ct) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    if (newPortfolio) {
      dispatch(
        actions.setPortfolio(
          newPortfolio(currentPrice, volatility, optionData, interest)
        )
      );
      dispatch(strategyActions.setInfo(ct));
    }

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
                    onClick={(e) =>
                      handleClose(
                        e,
                        util.getBullCallSpread,
                        util.BULL_CALL_SPREAD
                      )
                    }
                  >
                    Bull Call Spread
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(
                        e,
                        util.getBearPutSpread,
                        util.BEAR_PUT_SPREAD
                      )
                    }
                  >
                    Bear Put Spread
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(e, util.getLongStraddle, util.LONG_STRADDLE)
                    }
                  >
                    Long Straddle
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(e, util.getShortStraddle, util.SHORT_STRADDLE)
                    }
                  >
                    Short Straddle
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(e, util.getLongButterfly, util.LONG_BUTTERFLY)
                    }
                  >
                    Long Butterfly
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(
                        e,
                        util.getShortButterfly,
                        util.SHORT_BUTTERFLY
                      )
                    }
                  >
                    Short Butterfly
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(e, util.getLongCondor, util.LONG_CONDOR)
                    }
                  >
                    Long Condor
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      handleClose(e, util.getShortCondor, util.SHORT_CONDOR)
                    }
                  >
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
