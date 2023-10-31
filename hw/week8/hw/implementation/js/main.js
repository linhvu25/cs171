// Bar chart configurations: data keys and chart titles
let configs = [
    {key: "ownrent", title: "Own or Rent"},
    {key: "electricity", title: "Electricity"},
    {key: "latrine", title: "Latrine"},
    {key: "hohreligion", title: "Religion"}
];


// Initialize variables to save the charts later
let barcharts = [];
let areachart;


// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%Y-%m-%d");

loadData();

function loadData() {

    // (1) Load CSV data
    d3.csv("data/household_characteristics.csv", row => {

        // (2) Convert strings to date objects
        row.survey = parseDate(row.survey);
        return row;

    }).then(csv => {

        data = csv;
        console.log(data);

        // * TO-DO *
        // (3) Create new bar chart objects
        configs.forEach((key, title) => {
            barcharts[title] = new BarChart("bar-chart", data, key)
        })

        // (4) Create new area chart object
        areachart = new AreaChart("area-chart", data)

    });
}


// React to 'brushed' event and update all bar charts
function brushed() {

    let selectionRange = d3.brushSelection(d3.select(".brush").node());
    let selectionDomain = selectionRange.map(areachart.x.invert);

    console.log("domain", selectionDomain);

    // * TO-DO *
    barcharts.forEach(function(chart){

        return chart.selectionChanged(selectionDomain);

    })
}
