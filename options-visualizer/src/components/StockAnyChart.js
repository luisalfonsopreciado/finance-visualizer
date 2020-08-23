import React, { useEffect, useState } from "react";
import AnyChart from "anychart-react";
import * as anychart from "anychart";

const StockAnyChart = ({ data, ticker }) => {
  console.log(data);

  // Create the chart
  var msftDataTable = anychart.data.table();
  // Add The data
  msftDataTable.addData(data);
  // Declare stock Chart
  var chart = anychart.stock();
  // Create plot
  var firstPlot = chart.plot(0);
  firstPlot.area(msftDataTable.mapAs({ value: 4 })).name("MSFT");
  chart.scroller().area(msftDataTable.mapAs({ value: 4 }));
  chart.selectRange("2005-01-03", "2005-11-20");

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
