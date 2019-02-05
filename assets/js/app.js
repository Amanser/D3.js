// Setup the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 81
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);




// Import data
d3.csv("assets/data/data.csv")
.then(function(healthcareData) {

    // Parse Data/Cast as numbers
    // ==============================
    healthcareData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(healthcareData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthcareData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthcareData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("opacity", ".9");

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Lacking Healthcare: ${d.healthcare}%`);
      });

    
    
    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this)
    })
      // On mouseout event
    circlesGroup.on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

      
    // Add labels to the data points
    chartGroup.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "9px")
      .style("font-weight", "bold")
      .selectAll("tspan")
      .data(healthcareData)
      .enter()
      .append("tspan")
          .attr("x", function(data) {
              return xLinearScale(data.poverty - 0);
          })
          .attr("y", function(data) {
              return yLinearScale(data.healthcare - 0.2);
          })
          .text(function(data) {
              return data.abbr
          });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 1.6))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %")
      .style("font-weight", "bold");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.1}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty %")
      .style("font-weight", "bold");
  });