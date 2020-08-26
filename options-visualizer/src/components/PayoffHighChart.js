import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "spline",
  },
  title: {
    text: "My chart",
  },
  plotOptions: {
    series: {
      allowPointSelect: false,
    },
  },
  series: [
    {
      name: "Name",
      data: [
        [5, 2],
        [6, 3],
        [8, 2],
      ],
    },
    {
      data: [
        [5, 3],
        [6, 4],
        [8, 3],
      ],
    },
  ],
};

const PayoffHighChart = ({ data }) => {
  return <HighchartsReact highcharts={Highcharts} options={data} />;
};

export default PayoffHighChart;
