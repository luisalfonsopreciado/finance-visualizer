import React from "react";
import * as anychart from "anychart";

const StockAnyChart2 = (props) => {
  // create data
  var data = [
    [Date.UTC(2007, 7, 23), 23.55, 23.88, 23.38, 23.62],
    [Date.UTC(2007, 7, 24), 22.65, 23.7, 22.65, 23.36],
    [Date.UTC(2007, 7, 25), 22.75, 23.7, 22.69, 23.44],
    [Date.UTC(2007, 7, 26), 23.2, 23.39, 22.87, 22.92],
    [Date.UTC(2007, 7, 27), 23.98, 24.49, 23.47, 23.49],
    [Date.UTC(2007, 7, 30), 23.55, 23.88, 23.38, 23.62],
    [Date.UTC(2007, 7, 31), 23.88, 23.93, 23.24, 23.25],
    [Date.UTC(2007, 8, 1), 23.17, 23.4, 22.85, 23.25],
    [Date.UTC(2007, 8, 2), 22.65, 23.7, 22.65, 23.36],
    [Date.UTC(2007, 8, 3), 23.2, 23.39, 22.87, 22.92],
    [Date.UTC(2007, 8, 6), 23.03, 23.15, 22.44, 22.97],
    [Date.UTC(2007, 8, 7), 22.75, 23.7, 22.69, 23.44],
  ];

  // create a chart
  const chart = anychart.candlestick();

  // create a japanese candlestick series and set the data
  var series = chart.candlestick(data);

  // set the container id
  chart.container("someId");

  // initiate drawing the chart
  chart.draw();

  return <div id="someId"></div>;
};
export default StockAnyChart2;
