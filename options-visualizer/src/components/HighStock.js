import React from "react";
import HighStock from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

function App({ mockData, ticker }) {
  let groupingUnits = [
    [
      "week", // unit name
      [1], // allowed multiples
    ],
    ["month", [1, 2, 3, 4, 6]],
  ];

  let mockOptions = {
    rangeSelector: {
      selected: 1,
    },

    title: {
      text: ticker + " Historical",
    },

    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "OHLC",
        },
        height: "60%",
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "65%",
        height: "35%",
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    series: [
      {
        type: "candlestick",
        data: mockData,
        dataGrouping: {
          units: groupingUnits,
        },
      },
      {
        type: "column",
        data: (function () {
          var columnData = [];

          for (var i = 0; i < mockData.length; i++) {
            columnData.push([
              mockData[i][0], // the date
              mockData[i][5], // the volume
            ]);
          }
          return columnData;
        })(),
        yAxis: 1,
      },
    ],
  };

  return (
    <div className="App">
      {
        <HighchartsReact
          highcharts={HighStock}
          constructorType={"stockChart"}
          options={mockOptions}
        />
      }
    </div>
  );
}

export default App;
