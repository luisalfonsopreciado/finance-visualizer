import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

Highcharts.theme = {
  colors: [
    "#2b908f",
    "#90ee7e",
    "#f45b5b",
    "#7798BF",
    "#aaeeee",
    "#ff0066",
    "#eeaaee",
    "#55BF3B",
    "#DF5353",
    "#7798BF",
    "#aaeeee",
  ],
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: "'Unica One', sans-serif",
    },
    plotBorderColor: "#606063",
  },
  title: {
    style: {
      color: "black",
      textTransform: "uppercase",
      fontSize: "20px",
    },
  },
  subtitle: {
    style: {
      color: "black",
      textTransform: "uppercase",
    },
  },
  xAxis: {
    gridLineColor: "black",
    labels: {
      style: {
        color: "black",
      },
    },
    lineColor: "black",
    minorGridLineColor: "#505053",
    tickColor: "black",
    title: {
      style: {
        color: "black",
      },
    },
  },
  yAxis: {
    gridLineColor: "black",
    labels: {
      style: {
        color: "black",
      },
    },
    lineColor: "black",
    minorGridLineColor: "#505053",
    tickColor: "black",
    tickWidth: 1,
    title: {
      style: {
        color: "black",
      },
    },
  },
  tooltip: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    style: {
      color: "#F0F0F0",
    },
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: "black",
        style: {
          fontSize: "13px",
        },
      },
      marker: {
        lineColor: "#333",
      },
    },
    boxplot: {
      fillColor: "#505053",
    },
    candlestick: {
      lineColor: "white",
    },
    errorbar: {
      color: "white",
    },
  },
  legend: {
    backgroundColor: "transparent",
    itemStyle: {
      color: "black",
    },
    itemHoverStyle: {
      color: "grey",
    },
    itemHiddenStyle: {
      color: "#606063",
    },
    title: {
      style: {
        color: "#C0C0C0",
      },
    },
  },
  credits: {
    style: {
      color: "#666",
    },
  },
  labels: {
    style: {
      color: "black",
    },
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: "black",
    },
    activeDataLabelStyle: {
      color: "black",
    },
  },
  navigation: {
    buttonOptions: {
      symbolStroke: "#DDDDDD",
      theme: {
        fill: "#505053",
      },
    },
  },
  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: "#505053",
      stroke: "#000000",
      style: {
        color: "#CCC",
      },
      states: {
        hover: {
          fill: "black",
          stroke: "#000000",
          style: {
            color: "white",
          },
        },
        select: {
          fill: "#000003",
          stroke: "#000000",
          style: {
            color: "white",
          },
        },
      },
    },
    inputBoxBorderColor: "#505053",
    inputStyle: {
      backgroundColor: "#333",
      color: "silver",
    },
    labelStyle: {
      color: "silver",
    },
  },
  navigator: {
    handles: {
      backgroundColor: "#666",
      borderColor: "#AAA",
    },
    outlineColor: "#CCC",
    maskFill: "rgba(255,255,255,0.1)",
    series: {
      color: "#7798BF",
      lineColor: "#A6C7ED",
    },
    xAxis: {
      gridLineColor: "#505053",
    },
  },
  scrollbar: {
    barBackgroundColor: "#808083",
    barBorderColor: "#808083",
    buttonArrowColor: "#CCC",
    buttonBackgroundColor: "#606063",
    buttonBorderColor: "#606063",
    rifleColor: "#FFF",
    trackBackgroundColor: "#404043",
    trackBorderColor: "#404043",
  },
};

const PayoffHighChart = ({ data, theme }) => {
  Highcharts.setOptions(Highcharts.theme);

  return <HighchartsReact highcharts={Highcharts} options={data} />;
};

export default PayoffHighChart;
