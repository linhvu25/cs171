
// SVG Size
let width 	= 700,
	height	= 500;
	padding 		= 25;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	d.Income 			= +d.Income;
	d.LifeExpectancy 	= +d.LifeExpectancy;
	d.Population 		= +d.Population;
	// TODO: convert values where necessary in this callback (d3.csv reads the csv line by line. In the callback,
	//  you have access to each line (or row) represented as a js object with key value pairs. (i.e. a dictionary).
	return d;
}).then( data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	draw(data);

});


// TODO: create a separate function that is in charge of drawing the data, which means it takes the sorted data as an argument
function draw (data){
	// TODO: sort the data
	data.sort( (a,b) => b.Population - a.Population)

	// scale
	var incomeScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.Income) - 5000,
			d3.max(data, d => d.Income) + 60000])
		.range([padding, width - padding])

	var lifeExpectancyScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.LifeExpectancy),
			d3.max(data, d => d.LifeExpectancy)])
		.range([height - padding, padding])

	var populationScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.Population),
			d3.max(data, d => d.Population)])
		.range([4, 30])

	var regionScale = d3.scaleOrdinal(d3.schemeCategory10);

	// TODO: Call your separate drawing function here, i.e. within the .then() method's callback function
	// create svg
	let svg = d3.select("#chart-area")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	// bind data and add circles
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx",   	d => incomeScale(d.Income))
		.attr("cy", 	d => lifeExpectancyScale(d.LifeExpectancy))
		.attr("r",  	d => populationScale(d.Population))
		.attr("fill", 	d => regionScale(d.Region))
		.attr("stroke", "black");

	// axis
	let xAxis = d3.axisBottom()
		.scale(incomeScale);
	let yAxis = d3.axisLeft()
		.scale(lifeExpectancyScale);

	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.attr("padding", 50)
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", "translate(" + padding + ", 0)")
		.call(yAxis);

	// add title and axis name
	svg.append("text")
		.text("Income of Country (USD)")
		.attr("x", 365)
		.attr("y", 466)

	svg.append("text")
		.text("Health Index")
		.attr("x", -20)
		.attr("y", 40)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end");

	svg.append("text")
		.text("Health & Wealth, by Country")
		.attr("x", 350)
		.attr("y", 30)
		.style("font-size", "18px")
		.style("text-anchor", "middle")
}
