import React, { Component } from 'react';
import MindFusion from 'mindfusion-common'
import $ from 'jquery'
import * as Charting from 'chart-library';

export class RealTimeChart extends Component {

constructor(props) {
		super(props);

		this.el = React.createRef();

		this.state = {
			chart: null
		}
	}
	
	componentDidMount() {
		var stockChart = new Charting.MindFusion.Charting.Controls.CandlestickChart(this.el.current);
		
		stockChart.title = "The Big Corporation";
		stockChart.theme.titleFontSize = 16;
		stockChart.candlestickWidth = 12;
		stockChart.showLegend = false;
		
		stockChart.showXCoordinates = false;
		stockChart.xAxisLabelRotationAngle = 30;

		stockChart.xAxis.minValue = 0;
		stockChart.xAxis.interval = 1;
		stockChart.xAxis.maxValue = 40;
		stockChart.xAxis.title = "Time";
		stockChart.yAxis.title = "Price";
		
		stockChart.gridType = Charting.MindFusion.Charting.GridType.Horizontal;
		stockChart.theme.gridColor1 = new Charting.MindFusion.Charting.Drawing.Color("#ffffff");
		stockChart.theme.gridColor2 = new Charting.MindFusion.Charting.Drawing.Color("#fafafa");
		stockChart.theme.gridLineColor = new Charting.MindFusion.Charting.Drawing.Color("#cecece");
		stockChart.theme.gridLineStyle = Charting.MindFusion.Charting.Drawing.DashStyle.Dash;

		stockChart.plot.seriesStyle = new Charting.MindFusion.Charting.CandlestickSeriesStyle(
			new Charting.MindFusion.Charting.Drawing.Brush("#ff2f26"),
			new Charting.MindFusion.Charting.Drawing.Brush("#00b140"),
			new Charting.MindFusion.Charting.Drawing.Brush("#2e2e2a"), 2,
			Charting.MindFusion.Charting.Drawing.DashStyle.Solid, stockChart.plot.seriesRenderers.item(0));

		stockChart.theme.axisLabelsBrush = stockChart.theme.axisTitleBrush = stockChart.theme.axisStroke =
			new Charting.MindFusion.Charting.Drawing.Brush("#2e2e2e");
		stockChart.theme.highlightStroke = new Charting.MindFusion.Charting.Drawing.Brush("#cecece");
		
		var dataList = new Charting.MindFusion.Charting.Collections.List();

		var intervalId = setInterval(this.updateStock.bind(this), 60000);
		this.setState({ chart: stockChart, data: dataList, intervalId: intervalId });
		this.updateStock();
	}
	
	updateStock() {
		$.getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=1min&apikey=demo", function (json) {

			var times = json["Time Series (1min)"];			

			var update = false;

			if (this.state.chart.series.count() > 0)
				update = true;

			for (var time in times) {
				var stock_info = times[time];

				var dataItem = new Charting.MindFusion.Charting.StockPrice(stock_info["1. open"], stock_info["4. close"], stock_info["3. low"],
					stock_info["2. high"], new Date(time));

				if (!update)
					this.state.data.insert(0, dataItem);
				else
				{
					this.state.data.add(dataItem);				
					this.state.data.removeAt(0);
					break;
				}
			}

			var series = new Charting.MindFusion.Charting.StockPriceSeries(this.state.data);
			series.dateTimeFormat = Charting.MindFusion.Charting.DateTimeFormat.ShortTime;

			var data = new Charting.MindFusion.Charting.Collections.ObservableCollection();
			data.add(series);
			this.state.chart.series = data;
			this.state.chart.draw();
		}.bind(this));
	}
	
render() {
		return (
			<div>
				<canvas width="1000px" height="800px" ref={this.el}></canvas>
			</div>
		);
	}

}





























