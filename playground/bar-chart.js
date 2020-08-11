const drawBarChart = async () => {
  const color = "steelblue";
  const height = 500;
  const margin = { top: 30, right: 0, bottom: 30, left: 40 };

  const barChartSvg = d3
    .select(".barChart")
    .append("svg")
    .attr("width", 700)
    .attr("height", 500);

  const csv = await d3.csv("alphabet.csv");
  const data = csv.map(({ letter, frequency }) => ({
    name: letter,
    value: +frequency,
  }));

  data.sort((a, b) => d3.descending(a.value, b.value));

  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .tickFormat((i) => data[i].name)
        .tickSizeOuter(0)
    );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
      );

  console.log(data);

  console.log(svg);

  barChartSvg
    .append("g")
    .attr("fill", "blue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => y(0) - y(d.value))
    .attr("width", x.bandwidth());

  barChartSvg.append("g").call(xAxis);

  barChartSvg.append("g").call(yAxis);

  barChartSvg.node();
};

drawBarChart();
