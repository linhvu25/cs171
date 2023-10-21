
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
	width = 650 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom,
	buffer = 50;

// create drawing space
let svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add text
let text = svg.append("text")
	.attr("x", margin.left)
	.attr("y", margin.top)
	.attr("dy", ".35em");

// color scale
var colorScale = d3.scaleOrdinal()
	.domain(["coffee", "tea"])
	.range(["brown", "green"]);

function updateVisualization(orders) {
	console.log(orders);

	// Data-join (circle now contains the update selection)
	let circle = svg.selectAll("circle")
		.data(orders, d=>d);

	// Enter (initialize the newly added elements)
	circle.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("fill", "#707086")

	// Enter and Update (set the dynamic properties of the elements)
		.merge(circle)
		.attr("r", 15)
		.attr("cx",(d,index)=>(index * 50) + 50 )
		.attr("cy", 80)
		.attr("fill", d=>colorScale(d.product));

	// Exit
	circle.exit().remove();

	// update text
	text.text("Orders: " + orders.length);
}