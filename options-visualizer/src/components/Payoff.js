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
      .tickFormat(d3.format(".02f"));

    d3.select("#chart svg") //Select the <svg> element you want to render the chart in.
      .datum(myData) //Populate the <svg> element with chart data...
      .call(chart); //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function () {
      chart.update();
    });

    return chart;
  });
  /**************************************
   * Simple test data generator
   */
};

const Payoff = (props) => {
  function sinAndCos() {
    var sin = [];

    //Data is represented as an array of {x,y} pairs.
    // for (var i = 0; i < 100; i++) {
    //   sin.push({ x: i, y: Math.sin(i / 10) });
    // }

    sin.push({ x: 0, y: 0.5 });
    sin.push({ x: 1, y: 0 });
    sin.push({ x: 2, y: 20 });

    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin, //values - represents the array of {x,y} data points
        key: "Sine Wave", //key  - the name of the series.
        color: "#ff7f0e", //color - optional: choose your own line color.
      },
    ];
  }

  useEffect(() => {
    /* Done setting the chart up? Time to render it!*/
    var myData = sinAndCos(); //You need data...

    console.log(myData);
    drawChart(myData);
  }, []);

  return (
    <div class="row">
      <div class="col-sm-12">
        <div class="panel panel-primary">
          <div class="panel-heading">Option Payoff</div>
          <div class="panel-body">
            <div id="chart">
              <svg></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payoff;
