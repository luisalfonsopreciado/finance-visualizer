import React from "react";
import { useEffect } from "react";
import * as d3 from "d3";
import * as nv from "nvd3";

const drawChart = (myData) => {
  /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
  nv.addGraph(function () {
    var chart = nv.models
      .lineChart()
      .margin({ left: 100 }) //Adjust chart margins to give the x-axis some breathing room.
      .useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
      .duration(1500) //how fast do you want the lines to transition?
      .showLegend(true) //Show the legend, allowing users to turn on/off line series.
      .showYAxis(true) //Show the y-axis
      .showXAxis(true); //Show the x-axis
    chart.xAxis //Chart x-axis settings
      .axisLabel("Price ($)")
      .tickFormat(d3.format(",r"));

    chart.yAxis //Chart y-axis settings
      .axisLabel("Profit ($)")
      .tickFormat(d3.format(",r"));

    d3.select("#chart svg") //Select the <svg> element you want to render the chart in.
      .datum(myData) //Populate the <svg> element with chart data...
      .call(chart); //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function () {
      chart.update();
    });
  });
};

const Payoff = ({ data, errors }) => {
  useEffect(() => {
    drawChart(data);
  }, [data]);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="panel panel-primary">
            <div className="panel-heading">Option Payoff</div>
            <div className="panel-body">
              {!errors ? (
                <div id="chart">
                  <svg></svg>
                </div>
              ) : (
                <h1>Enter Valid Data To View Chart</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Payoff;
