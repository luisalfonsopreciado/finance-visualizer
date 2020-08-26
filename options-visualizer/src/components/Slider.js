import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
  slider: { width: "90%" },
});

export default function InputSlider({ value, setValue, title, min, max }) {
  const classes = useStyles();

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TrendingUpIcon />
        </Grid>
        <Grid item xs>
          <Slider
            min={min}
            max={max}
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            className={classes.slider}
          />
        </Grid>
        <Grid item></Grid>
      </Grid>
    </div>
  );
}
