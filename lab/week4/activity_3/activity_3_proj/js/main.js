console.log("let's get started!")

// load data
d3.csv("data/cities.csv").then(function(data) {
    console.log(data); // [{name: "Thesis", price: "7.95", size: "large"},..]
});

// prepare data
let city_eu = [];
let city = d3.csv("data/cities.csv", (row) => {
    // convert to numeric
    row.population = +row.population
    row.x = +row.x
    row.y = +row.y
    return row
}).then( (data) => {
    // check out the data and do whatever you want with it
    console.log(data)

    // filter
    city_eu = data.filter( item => item.eu === "true")
    let num_countries = city_eu.length;
    d3.select("body")
        .select("p")
        .text("Number of EU countries: " + num_countries)

    // create drawing space
    let svg = d3.select("body")
        .append("svg")
        .attr("width", 700)
        .attr("height", 550);

    console.log(city_eu)
    // add circles
    svg.selectAll("circle")
        .data(city_eu)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => {
            if(d.population < 1000000) return 4
            else return 8
        });
    svg.selectAll("text")
        .data(city_eu)
        .enter()
        .append("text")
        .text(d => d.city)
        .attr("class", "city-label")
        .attr("x", d => d.x - 10)
        .attr("y", d => d.y - 10)
        .attr( "fill-opacity", d => {
            if (d.population < 1000000) return 0
            else return 100
        });
})

