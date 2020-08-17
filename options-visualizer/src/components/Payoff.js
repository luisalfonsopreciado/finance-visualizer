import React, { useEffect } from "react";
import * as d3 from "d3";
import * as nv from "nvd3";

const Payoff = ({ data }) => {
  // Clear the Charts
  d3.selectAll("svg > *").remove();

  const drawChart = ({ data: myData, Ydomain }) => {
    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    nv.addGraph(() => {
      const newChart = nv.models
        .lineChart()
        .margin({ left: 100 }) //Adjust chart margins to give the x-axis some breathing room.
        .useInteractiveGuideline(false) //We want nice looking tooltips and a guideline!
        .duration(1500) //how fast do you want the lines to transition?
        .showLegend(true) //Show the legend, allowing users to turn on/off line series.
        .showYAxis(true) //Show the y-axis
        .showXAxis(true); //Show the x-axis

      newChart.xAxis //Chart x-axis settings
        .axisLabel("Price ($)")
        .tickFormat((d) => d);

      newChart.yAxis //Chart y-axis settings
        .axisLabel("Profit ($)")
        .tickFormat((d) => d);

      newChart.forceY(Ydomain);

      d3.select("#chart svg") //Select the <svg> element you want to render the chart in.
        .datum(myData) //Populate the <svg> element with chart data...
        .call(newChart); //Finally, render the chart!

      // Update the chart when window resizes.
      nv.utils.windowResize(newChart.update);

      return newChart;
    });
  };

  // UseEffect with no deps so that a chart is always rendered
  useEffect(() => {
    data && drawChart(data);
  })

  console.log("Payoff Rendered")

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="panel panel-primary">
            <div className="panel-heading">Option Payoff</div>
            <div className="panel-body">
              <div id="chart">
                <svg></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payoff;
