

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

let plotColor = "#5F9EA0";
	strokeColor = "#088F8F";

class BarChart {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.config = config;
		this.displayData = data;

		console.log(this.displayData);

		this.initVis();
	}

	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */

	initVis() {
		let vis = this;

		// * TO-DO *
		vis.margin = {top: 20, right: 60, bottom: 20, left: 100};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 150 - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes
		vis.x = d3.scaleLinear()
			.range([0, vis.width]);

		vis.y = d3.scaleBand()
			.rangeRound([vis.height, 0])
			.paddingInner(0.2);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}

	/*
	 * Data wrangling
	 */

	wrangleData() {

		let vis = this;
		// (1) Group data by key variable (e.g. 'electricity') and count leaves

		let agg = Array.from(d3.rollup(vis.displayData,leaves => leaves.length, d=>d[vis.config.key]),
			([key, value]) => ({key, value}));

		// (2) Sort columns descending
		vis.sortedData = agg.sort((a,b) => (a.value-b.value));

		// * TO-DO *
		// Update the visualization
		vis.updateVis();
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		let vis = this;

		// (1) Update domains
		vis.x.domain([0, d3.max(vis.sortedData, d=>d.value)])
		vis.y.domain(vis.sortedData.map(d=>d.key));

		// (2) Draw rectangles
		let bars = vis.svg.selectAll("rect")
			.data(vis.sortedData)

		bars.enter()
			.append("rect")
			.merge(bars)
			.attr("x", 0)
			.attr("y", d=>vis.y(d.key))
			.attr("height", vis.y.bandwidth())
			.attr("width", d=>vis.x(d.value))
			.attr("fill", plotColor)
			.attr("stroke", strokeColor);

		bars.exit().remove();

		// (3) Draw labels
		let labels = vis.svg.selectAll(".label")
			.data(vis.sortedData)

		labels.enter()
			.append("text")
			.attr("class","label")
			.merge(labels)
			.attr("x", d => vis.x(d.value) + 5)
			.attr("y", d => vis.y(d.key) + vis.y.bandwidth()/2)
			.text(d => d.value);

		labels.exit().remove();

		// title
		vis.svg.append("text")
			.attr("class","title")
			.attr("x", -40)
			.attr("y", -5)
			.text(vis.config.title);

		// Update the y-axis
		vis.svg.select(".y-axis").call(vis.yAxis);

	}

	/*
	 * Filter data when the user changes the selection
	 * Example for brushRegion: 07/16/2016 to 07/28/2016
	 */

	selectionChanged(brushRegion) {
		let vis = this;

		// Filter data accordingly without changing the original data
		vis.displayData = vis.data.filter(d=>d.survey <= brushRegion[1] & d.survey >= brushRegion[0])

		// Update the visualization
		vis.wrangleData();
	}
}
