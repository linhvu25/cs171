
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};
	buffer = 20
	transitionTime = 800
	color = "#4B6D4A";

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");

// Scales
let x = d3.scaleLinear()
	.range([0, width]);

let y = d3.scaleLinear()
	.range([height, 0]);

let yAxis = d3.axisLeft()
	.scale(y);
svg.append("g")
	.attr("class", "y-axis axis");

let xAxis = d3.axisBottom()
	.tickFormat(d3.format("d"))
	.scale(x);
svg.append("g")
	.attr("class", "x-axis axis");

// Initialize data
loadData();

// FIFA world cup
let data;
let newData;
let slider;


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", row => {
		row.YEAR = parseDate(row.YEAR);
		row.TEAMS = +row.TEAMS;
		row.MATCHES = +row.MATCHES;
		row.GOALS = +row.GOALS;
		row.AVERAGE_GOALS = +row.AVERAGE_GOALS;
		row.AVERAGE_ATTENDANCE = +row.AVERAGE_ATTENDANCE;
		return row
	}).then(csv => {

		// Store csv data in global variable
		data = csv;

		// slider
		slider = document.getElementById('slider');
		var yearMin = parseFloat(d3.min(data, d=>formatDate(d.YEAR)))
		var yearMax = parseFloat(d3.max(data, d=>formatDate(d.YEAR)))
		console.log(yearMax)
		console.log(yearMin)

		noUiSlider.create(slider, {
			start: [yearMin, yearMax],
			connect: true,
			behaviour: "drag",
			step: 1,
			margin: 1,
			range: {
				'min': yearMin,
				'max': yearMax
			}
		});

		slider.noUiSlider.on('slide', function (values, handle) {

			updateVisualization();
		});

		// Draw the visualization for the first time
		d3.select("#data-type").on("change", function() {
			updateVisualization();
		})
		updateVisualization();
	});
}

// Render visualization

function updateVisualization() {

	let value = d3.select("#data-type").property("value");

	let start = slider.noUiSlider.get()[0]
	let end = slider.noUiSlider.get()[1]

	let newData = data.filter((d) => parseFloat(formatDate(d.YEAR)) >= start &&
		parseFloat(formatDate(d.YEAR)) <= end)

	// set domain of scales
	x.domain([d3.min(newData, d=>formatDate(d.YEAR)),
		d3.max(newData, d=>formatDate(d.YEAR))]);
	y.domain([0, d3.max(newData, d=>d[value])]);

	// line
	let linegraph = svg.selectAll(".line")
		.data([newData], d=>d.YEAR)

	linegraph.enter()
		.append("path")
		.attr("class", "line")
		.merge(linegraph)
		.attr("fill", "none")
		.attr("stroke", color)
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
			.x(d => x(formatDate(d.YEAR)))
			.y(d => y(d[value]))
			.curve(d3.curveLinear))
		.transition()
		.duration(transitionTime)
		.attr("transform", "translate("+ buffer + ",0)");

	// circles
	let circles = svg.selectAll("circle")
		.data(newData, d=>d)

	circles.enter()
		.append("circle")
		.merge(circles)
		.on("click", (event, d) => showEdition(d))
		.attr("cx", d=> x(formatDate(d.YEAR)))
		.attr("cy", d=> y(d[value]))
		.attr("r", 4)
		.attr("transform", "translate(" + buffer + ",0)")
		.transition()
		.duration(transitionTime)
		.attr("fill", color);

	circles.exit().remove();

	// axis
	svg.select(".y-axis")
		.transition()
		.duration(transitionTime)
		.call(yAxis);
	svg.select(".x-axis")
		.attr("transform", "translate(" + buffer + "," + height + ")")
		.transition()
		.duration(transitionTime)
		.call(xAxis);

}

// Show details for a specific FIFA World Cup
function showEdition(d){
	d3.select("#edition")
		.text(d.EDITION)
	d3.select("#winner")
		.text(d.WINNER);
	d3.select("#goals")
		.text(d.GOALS);
	d3.select("#avgGoals")
		.text(d.AVERAGE_GOALS);
	d3.select("#matches")
		.text(d.MATCHES);
	d3.select("#teams")
		.text(d.TEAMS);
	d3.select("#avgAttendance")
		.text(d.AVERAGE_ATTENDANCE);
}
