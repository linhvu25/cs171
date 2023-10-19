console.log("let's get started!")

// create drawing space
let svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

// dataset
let sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
];

// add circles
svg.selectAll("circle")
    .data(sandwiches)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => i*60)
    .attr("fill", d => {
        if(d.price < 7) return "green"
        else return "yellow"
    })
    .attr("r", d => {
        if(d.size === "large") return 20
        else return 10
    })
    .attr("stroke", "black");