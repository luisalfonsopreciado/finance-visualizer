import React, { useEffect } from "react";
const Highcharts = require("highcharts");

const HighChartDemo = (props) => {
  console.log(Highcharts);
  useEffect(() => {
    var myChart = Highcharts.chart("highchart", {
      chart: {
        type: "bar",
      },
      title: {
        text: "Fruit Consumption",
      },
      xAxis: {
        categories: ["Apples", "Bananas", "Oranges"],
      },
      yAxis: {
        title: {
          text: "Fruit eaten",
        },
      },
      series: [
        {
          name: "Jane",
          data: [1, 0, 4],
        },
        {
          name: "John",
          data: [5, 7, 3],
        },
      ],
    });
  }, []);
  return <div id="highchart" style={{ width: "100%", height: "400px" }}></div>;
};
export default HighChartDemo;
