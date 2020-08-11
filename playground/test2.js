// create margins & dimensions

const width = 1000;
const height = 500;

const getData = async () => {
  const data = await d3.json("values@1.json");

  const svg = d3
    .select(".histogram")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data))
    .nice()
    .range([margin.left, width - margin.right]);

  const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(40))(data);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", width - margin.right)
          .attr("y", -4)
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .text("X Axis Title")
      );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .select(".tick:last-of-type text")
          .clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Y Axis Title")
      );

  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => i * 8)
    .attr("width", (d) => 8)
    .attr("y", (d) => 0)
    .attr("height", (d) => y(d));

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  svg.node();
};

getData();
