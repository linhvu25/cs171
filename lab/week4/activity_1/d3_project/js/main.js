console.log("let's get started!")
d3.select("body")
    .append("div")
    .text("Dynamic Content");

// EXAMPLE 1
let states = ["Connecticut", "Main", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont"];

// Change the CSS property background (lightgray)
d3.select("body")
    .style("background-color", "#EEE");

// Append paragraphs and highlight one element
d3.select("body").selectAll("p")
    .data(states)
    .enter()
    .append("p")
    .text(d => d)
    .attr("class", "custom-paragraph")
    .style("color", "blue")
    .style("font-weight", d => {
        if(d === "Massachusetts")
            return "bold";
        else
            return "normal";
    });

// EXAMPLE 2
let numericData = [1, 2, 4, 8, 16];

// Add svg element (drawing space)
let svg = d3.select("body").append("svg")
    .attr("width", 300)
    .attr("height", 50);

// Add rectangle
svg.selectAll("rect")
    .data(numericData)
    .enter()
    .append("rect")
    .attr("fill", "red")
    .attr("width", 50)
    .attr("height", 50)
    .attr("y", 0)
    .attr("x", (d, i) => i * 60)