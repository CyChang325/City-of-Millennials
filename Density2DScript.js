function generate2dDensityChart(csvURL, chartID) {
   // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 260- margin.left - margin.right,
height = 220 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(chartID)
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv(csvURL, function(data) {

// Add X axis
var x = d3.scaleLinear()
.domain([0, 1])
.range([ 0, width ]);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
.domain([0, 1])
.range([ height, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

// Reformat the data: d3.hexbin() needs a specific format
var inputForHexbinFun = []
data.forEach(function(d) {
inputForHexbinFun.push( [x(d.x), y(d.y)] )  // Note that we had the transform value of X and Y !
})

// Prepare a color palette
var color = d3.scaleLinear()
  .domain([0, 7]) // Number of points in the bin?
  .range(["transparent",  "#d676a3"])

// Compute the hexbin data
var hexbin = d3.hexbin()
.radius(5) // size of the bin in px
.extent([ [0, 0], [width, height] ])

// Plot the hexbins
svg.append("clipPath")
  .attr("id", "clip")
.append("rect")
  .attr("width", width)
  .attr("height", height)

svg.append("g")
.attr("clip-path", "url(#clip)")
.selectAll("path")
.data( hexbin(inputForHexbinFun) )
.enter().append("path")
  .attr("d", hexbin.hexagon())
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  .attr("fill", function(d) { return color(d.length); })
  .attr("stroke", "b#d676a3lack")
  .attr("stroke-width", "0.1")
})
}