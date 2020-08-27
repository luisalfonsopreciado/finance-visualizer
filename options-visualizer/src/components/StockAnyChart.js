import React from "react";
import AnyChart from "anychart-react";
import * as anychart from "anychart";
import * as util from "../utility";

const StockAnyChart = ({ data, ticker }) => {
  const newData = [];
  data.forEach((pnt) => {
    newData.push([
      util.UNIXToDateString(pnt[0]),
      pnt[1],
      pnt[2],
      pnt[3],
      pnt[4],
    ]);
  });
  // Create the chart
  var stockDataTable = anychart.data.table();
  // Add The data
  stockDataTable.addData(newData);
  // Declare stock Chart
  var chart = anychart.stock();
  // Create plot
  var firstPlot = chart.plot(0);
  firstPlot.area(stockDataTable.mapAs({ value: 4 })).name(ticker);
  chart.scroller().area(stockDataTable.mapAs({ value: 4 }));
  chart.selectRange("2018-01-03", "2019-01-01");

  return (
    <>
      {!chart ? (
        <h1>Unable to Display Data</h1>
      ) : (
        <AnyChart width="100%" height={300} instance={chart} title={ticker} />
      )}
    </>
  );
};

export default StockAnyChart;
