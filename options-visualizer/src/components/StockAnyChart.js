import React from "react";
import AnyChart from "anychart-react";
import * as anychart from "anychart";

const StockAnyChart = (props) => {
  var msftDataTable = anychart.data.table();
  msftDataTable.addData(window.get_msft_daily_short_data());
  var chart = anychart.stock();
  var firstPlot = chart.plot(0);
  firstPlot.area(msftDataTable.mapAs({ value: 4 })).name("MSFT");
  chart.scroller().area(msftDataTable.mapAs({ value: 4 }));
  chart.selectRange("2005-01-03", "2005-11-20");
  
  return (
    <AnyChart width="100%" height={300} instance={chart} title="MSFT" />
  );
};

export default StockAnyChart;
