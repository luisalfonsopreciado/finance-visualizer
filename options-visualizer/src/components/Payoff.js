import React from "react";
import * as d3 from "d3";
import * as nv from "nvd3";

const Payoff = ({ data }) => {
  // Clear the Charts
  d3.selectAll("nvd3chart").remove();

  const drawChart = ({ data: myData, Ydomain }) => {
    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    nv.addGraph(() => {
      const newChart = nv.models
        .lineChart()
        .margin({ left: 100 }) //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(false) //We want nice looking tooltips and a guideline!
        // .duration(1500) //how fast do you want the lines to transition? Was removed, caused wrong data points positions after doing a transition bug https://github.com/novus/nvd3/issues/2018
        .showLegend(true) //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true) //Show the y-axis
        .showXAxis(true); //Show the x-axis

      newChart.xAxis //Chart x-axis settings
        .axisLabel("Price ($)")
        .tickFormat(d3.format(",.2f"));

      newChart.yAxis //Chart y-axis settings
        .axisLabel("Profit ($)")
        .tickFormat(d3.format(",.2f"));

      newChart.forceY(Ydomain);

      d3.select("#chart svg") //Select the <svg> element you want to render the chart in.
        .datum(myData) //Populate the <svg> element with chart data...
        .call(newChart); //Finally, render the chart!

      // Update the chart when window resizes.
      nv.utils.windowResize(newChart.update);

      return newChart;
    });
  };

  data && drawChart(data);
  return (
    <>
      <div className="panel-body">
        <div id="chart">
          <svg id="nvd3chart"></svg>
        </div>
      </div>
    </>
  );
};

export default Payoff;
