console.log("let's get started!")

let buildings =[];

// load data
let data = [];
d3.csv("data/buildings.csv", (row) => {
    // convert to numeric
    row.completed   = +row.completed
    row.floors      = +row.floors
    row.height_ft   = +row.height_ft
    row.height_m    = +row.height_m
    row.height_px   = +row.height_px
    return row;
}).then( (data) => {

    console.log(data);
    buildings = data;

    // sort by highest to lowest value
    buildings.sort((a, b) => parseFloat(b.height_m) - parseFloat(a.height_m));

    // create drawing space
    let svg = drawSVG("#bar-chart", 750, 500);

    // add bars
    let bars = drawBars(svg, buildings);

    // add building names
    let names = addNames(svg, buildings);

    // add building height
    addHeight(svg, buildings);

    // add text
    d3.select("#caption")
        .text("Building heights specified in meters (m). " +
            "Click on the building name or the bar to display further info.")

    // add interactive
    bars.on('click', function (event, d){
        displayInfo(d);

    });
    names.on('click', function (event, d){
        displayInfo(d);
    });
})

// create interactive function
function displayInfo (d) {
    console.log(d);
    d3.select("#name")
        .text(d.building);
    d3.select("#image")
        .attr("src", "img/" + d.image);
    d3.select("#height")
        .text(d.height_m);
    d3.select("#city")
        .text(d.city);
    d3.select("#country")
        .text(d.country);
    d3.select("#floors")
        .text(d.floors);
    d3.select("#completed")
        .text(d.completed);
}

// create drawing space
function drawSVG (id, width, height) {
    return d3.select(id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}

// draw bars
function drawBars (object, data){
    return object.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", d => d.height_px)
        .attr("height", 30)
        .attr("x", 280)
        .attr("y", (d, i) => i*40)
        .attr("fill", "teal");
}

// add building name
function addNames (object, data) {
    return object.selectAll("buildingName")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.building)
        .attr("class", "buildingName")
        .attr("y", (d, i) => i*40 + 20)
        .attr("x", 250);
}

// add building height
function addHeight(object, data) {
    return object.selectAll("buildingHeight")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.height_m)
        .attr("class", "buildingHeight")
        .attr("y", (d, i) => i*40 + 20)
        .attr("x", d => d.height_px + 240);
}


