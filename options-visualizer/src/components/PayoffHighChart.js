import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PayoffHighChart = ({ data }) => {
  return <HighchartsReact highcharts={Highcharts} options={data} />;
};

export default PayoffHighChart;
