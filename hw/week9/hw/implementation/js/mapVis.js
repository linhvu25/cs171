/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

let brushColor = "#FA8072"


class MapVis {

    constructor(parentElement, mapData, covidData, usaData){
        this.parentElement = parentElement;
        this.mapData = mapData;
        this.covidData = covidData;
        this.usaData = usaData;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;

        // margin
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')

        // zoom
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // draw map
        vis.map = topojson.feature(vis.mapData, vis.mapData.objects.states).features
        //console.log("usa data", vis.map);

        vis.states = vis.svg.selectAll(".state")
            .data(vis.map)
            .enter()
            .append("path")
            .attr('class', 'state')
            .attr("d", d3.geoPath())
            .attr("stroke", "#136D70")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        // check out the data
        // console.log(vis.covidData)
        // console.log(vis.usaData)

        // first, filter according to selectedTimeRange, init empty array
        let filteredData = [];

        // if there is a region selected
        if (selectedTimeRange.length !== 0) {
            //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.covidData.forEach(row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0].getTime() <= vis.parseDate(row.submission_date).getTime() && vis.parseDate(row.submission_date).getTime() <= selectedTimeRange[1].getTime()) {
                    filteredData.push(row);
                }
            });
        } else {
            filteredData = vis.covidData;
        }

        // prepare covid data by grouping all rows by state
        let covidDataByState = Array.from(d3.group(filteredData, d => d.state), ([key, value]) => ({key, value}))

        // have a look
        // console.log(covidDataByState)

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        // merge
        covidDataByState.forEach(state => {

            // get full state name
            let stateName = nameConverter.getFullName(state.key)

            // init counters
            let newCasesSum = 0;
            let newDeathsSum = 0;
            let population = 0;

            // look up population for the state in the census data set
            vis.usaData.forEach(row => {
                if (row.state === stateName) {
                    population += +row["2020"].replaceAll(',', '');
                }
            })

            // calculate new cases by summing up all the entries for each state
            state.value.forEach(entry => {
                newCasesSum += +entry['new_case'];
                newDeathsSum += +entry['new_death'];
            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: stateName,
                    population: population,
                    absCases: newCasesSum,
                    absDeaths: newDeathsSum,
                    relCases: (newCasesSum / population * 100),
                    relDeaths: (newDeathsSum / population * 100)
                }
            )
        })

        // console.log('final data structure for myMapVis', vis.stateInfo);

        this.updateVis();



        // function categoryChange() {
        //     selectedCategory =  document.getElementById('categorySelector').value;
        //     myMapVis.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
        // }???
    }

    updateVis(){
        let vis = this;

        let colorScale = d3.scaleLinear()
            .domain([d3.min(vis.stateInfo, d=>d[selectedCategory]),
                d3.max(vis.stateInfo, d=>d[selectedCategory])])
            .range(["white", "teal"]);

        vis.states
            .style("fill", function(d){
                let index = vis.stateInfo.map(function(e) { return e.state; }).indexOf(d.properties.name);
                return colorScale(vis.stateInfo[index][selectedCategory])
            })
            .on('mouseover', function(event, d){

                // change the fill
                d3.select(this)
                    .style('fill', brushColor)

                // get tooltip info
                let index = vis.stateInfo.map(function(e) { return e.state; }).indexOf(d.properties.name);
                let info = vis.stateInfo[index]

                // update tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>State: ${info.state}<h3>
                             <h4>Absolute cases: ${info.absCases}</h4>
                             <h4>Relative cases: ${info.relCases.toFixed(3)}</h4>
                             <h4>Relative deaths: ${info.relDeaths.toFixed(3)}</h4>
                             <h4>Population: ${info.population}</h4>
                        </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .style("fill", function(d){
                        let index = vis.stateInfo.map(function(e) { return e.state; }).indexOf(d.properties.name);
                        return colorScale(vis.stateInfo[index][selectedCategory])
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }
}