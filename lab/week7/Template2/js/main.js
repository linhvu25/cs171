
// SVG drawing area

let margin = {top: 40, right: 10, bottom: 60, left: 60};
	buffer = 20;

let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area")
			.append("svg")
    		.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
  			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
let x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);

let yAxis = d3.axisLeft()
	.scale(y);
svg.append("g")
	.attr("class", "y-axis axis");

let xAxis = d3.axisBottom()
	.scale(x);
svg.append("g")
	.attr("class", "x-axis axis");

// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv").then(csv=> {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

        // updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...
	});
}

// Render visualization
function updateVisualization() {

	console.log(data);

	d3.select("#ranking-type").on("change", function(){

		let value = d3.select("#ranking-type").property("value");
		console.log(value);

		// sort data
		data.sort((a,b)=> b[value] - a[value]);

		// set domain of scales
		x.domain(data.map(d=>d.company));
		y.domain([0, d3.max(data, d=>d[value])]);

		// draw bars
		let bars = svg.selectAll("rect")
			.data(data, d=>d)

		// dynamically update bar chart
		bars.enter()
			.append("rect")
			.merge(bars)
			.attr("x", d=> x(d.company))
			.attr("y", d=> y(d[value]))
			.attr("transform", "translate(" + buffer + ",0)")
			.attr("height", d=> height - y(d[value]))
			.transition()
			.duration(2000)
			.attr("width", x.bandwidth())
			.attr("fill", "#865F3C");

		bars.exit().remove();

		svg.select(".y-axis")
			.attr("transform", "translate(" + buffer - 20 + ",0)")
			.transition()
			.duration(2000)
			.call(yAxis);
		svg.select(".x-axis")
			.attr("transform", "translate(" + buffer + "," + height + ")")
			.transition()
			.duration(2000)
			.call(xAxis);
	});

}