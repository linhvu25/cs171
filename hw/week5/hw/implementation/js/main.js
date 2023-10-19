// load data
d3.csv("data/refugee.csv", (row) => {

    // convert
    row.population  = +row.population
    const parseTime = d3.utcParse("%Y-%m-%d");
    row.date = parseTime(row.date);

    return row;
}).then( (data) => {

    // console.log(data);

    drawAreaChart(data);
    drawBarChart();
})

// function to draw area chart

function drawAreaChart(data){

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        buffer = 50;

    // create drawing area
    let svg = d3.select("#area-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // y axis
    var populationScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([height, 0])
    svg.append("g")
        .attr("transform", "translate("+ buffer + ",0)")
        .call(d3.axisLeft(populationScale));

    // x axis
    var timeScale = d3.scaleUtc()
        .domain([d3.min(data, d=>d.date),
            d3.max(data, d=>d.date)])
        .range([0, width])
    var xAxis = d3.axisBottom(timeScale)
        .tickFormat(d3.timeFormat("%Y %b"));
    svg.append("g")
        .attr("transform", "translate(" + buffer + ", " + height + ")")
        .call(xAxis);

    // create area chart
    const area = d3.area()
        .x(d => timeScale(d.date))
        .y0(height)
        .y1(d => populationScale(d.population));

    // add title
    svg.append("text")
        .text("Camp Population")
        .attr("id", "title1")
        .attr("x", width/2)
        .attr("y", margin.top/2)

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate("+ buffer + ",0)");

    // tool tip
    var tooltip = svg.append("g")
        //.attr("display", "none")
        .attr("id", "navigate")
    tooltip.append("line")
        .attr("x1", 0)
        .attr("y1", margin.top*2)
        .attr("x2", 0)
        .attr("y2", height - 10)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate("+ buffer + ",0)")
    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 30)
        .attr("id", "population")
    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 50)
        .attr("id", "date")

    // add empty rect
    svg.append("rect")
        .attr("x", timeScale(d3.min(data, d => d.date)))
        .attr("y", populationScale(d3.max(data, d => d.population)))
        .attr("height", populationScale(0))
        .attr("width", timeScale(d3.max(data, d => d.date)) - timeScale(d3.min(data, d => d.date)))
        .style("fill-opacity", 0)
        .attr("transform", "translate("+ buffer + ",0)")
        .on("mouseover", (event) => tooltip.style("display", "block"))
        .on("mouseout", (event) => tooltip.style("display", "none"))
        .on("mousemove", mousemove)
    function mousemove(event){

        //console.log(event);

        let bisectDate = d3.bisector(d=>d.date).left;

        // grab info
        var x_position = d3.pointer(event)[0];
        var date = timeScale.invert(x_position);
        var index = bisectDate(data, date);
        var info = data[index];

        // console.log(info);

        // shift tooltip group
        tooltip.attr("transform", "translate(" + x_position + ",10)");

        // update tooltip texts
        tooltip.select("#population")
            .text("Population: " + info.population);
        var formatDate = d3.timeFormat("%Y-%b-%d");
        tooltip.select("#date")
            .style("fill", "grey")
            .text("Date: " + formatDate(info.date));
    }

}

// function to draw bar chart
function drawBarChart(){

    // data
    var shelter = [
        {type: "Caravans", value: 79.68},
        {type: "Combinations*", value: 10.81},
        {type: "Tents", value: 9.51}
    ];

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 450 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        buffer = 50;

    // set drawing space
    let svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x axis
    var xScale = d3.scaleBand()
        .domain(["Caravans", "Combinations*", "Tents"])
        .range([0, width])
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(" + buffer + "," + height + ")")
        .call(d3.axisBottom(xScale));

    // y axis
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([height,0])
    svg.append("g")
        .attr("transform", "translate("+ buffer + ",0)")
        .call(d3.axisLeft(yScale));

    // add bars
    svg.selectAll("rect")
        .data(shelter)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.type))
        .attr("height", d => height - yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.value))
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("transform", "translate("+ 50 + ",0)");

    // labels for bars
    svg.selectAll(".text")
        .data(shelter)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", d => xScale(d.type))
        .attr("y", d => yScale(d.value))
        .text(d => d.value + "%")
        .attr("transform", "translate(80,-5)");

    // title
    svg.append("text")
        .text("Types of Shelter")
        .attr("id", "title2")
        .attr("x", width/2)
        .attr("y", margin.top/2)
}