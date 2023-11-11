/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, covidData, usaData, descending){
        this.parentElement = parentElement;
        this.covidData = covidData;
        this.usaData = usaData;
        this.descending = descending;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(function(d){
                if(vis.descending) return "Most Affected States"
                else return "Least Affected States"
        })
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2);

        vis.y = d3.scaleLinear()
            .range([vis.height,0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // TODO

        this.wrangleData();
    }

    wrangleData(){
        let vis = this
        // Pulling this straight from dataTable.js
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
        // TODO: Sort and then filter by top 10
        // maybe a boolean in the constructor could come in handy ?

        if (vis.descending){
            vis.stateInfo.sort((a,b) => {return b[selectedCategory] - a[selectedCategory]})
        } else {
            vis.stateInfo.sort((a,b) => {return a[selectedCategory] - b[selectedCategory]})
        }

        // console.log('final data structure', vis.stateInfo);

        vis.topTenData = vis.stateInfo.slice(0, 10)

        // console.log('final data structure', vis.topTenData);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        let colorScale = d3.scaleLinear()
            .domain([d3.min(vis.stateInfo, d=>d[selectedCategory]),
                d3.max(vis.stateInfo, d=>d[selectedCategory])])
            .range(["white", "teal"]);

        // (1) Update domains
        vis.x.domain(vis.topTenData.map(d=>d.state));
        vis.y.domain([d3.min(vis.topTenData, d=>d[selectedCategory]), d3.max(vis.topTenData, d=>d[selectedCategory])])

        // (2) Draw rectangles
        let bars = vis.svg.selectAll("rect")
            .data(vis.topTenData)

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("x", d=>vis.x(d.state))
            .attr("y", d=>vis.y(d[selectedCategory]))
            .attr("width", vis.x.bandwidth())
            .attr("height", d=>vis.height-vis.y(d[selectedCategory]))
            .attr("fill", d=>colorScale(d[selectedCategory]))
            .attr("stroke", 'black')
            .on('mouseover', function(event, d){

            // change the fill
            d3.select(this)
                .style('fill', brushColor)
                //console.log("info", d)

            // update tooltip
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>State: ${d.state}<h3>
                             <h4>Absolute cases: ${d.absCases}</h4>
                             <h4>Relative cases: ${d.relCases.toFixed(3)}</h4>
                             <h4>Relative deaths: ${d.relDeaths.toFixed(3)}</h4>
                             <h4>Population: ${d.population}</h4>
                        </div>`);
        })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .style("fill", d=>colorScale(d[selectedCategory]))

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        bars.exit().remove();

        // Update axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.select(".y-axis").call(vis.yAxis);

        // console.log('here')

    }



}