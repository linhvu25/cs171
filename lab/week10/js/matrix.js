class Matrix {
    constructor(parentElement, marriageData, businessData, attributesData) {
        this.parentElement  = parentElement;
        this.marriageData   = marriageData;
        this.businessData   = businessData;
        this.attributesData = attributesData;
        this.displayData    = [];
        this.selectedCategory = "index";
        this.key = function(d){
            return d.name;
        }
        this.key2 = function(d){
            return d.Family;
        }

        this.cellHeight    = 20;
        this.cellWidth     = 20;
        this.cellPadding   = 10;
        this.marriageColor = "#5D3FD3";
        this.businessColor = "#FFAC1C";
        this.noTiesColor   = "lightgrey";

        this.initVis()
    }

    initVis(){
        let vis = this;

        // margin
        vis.margin = {top: 70, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.bottom + vis.margin.top)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // legend
        vis.legendMarriage2 = d3.select("#marriage")
            .append("rect")
            .attr("x", 20)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", vis.marriageColor)

        // create data
        vis.marriageData.forEach((d,i) => {

                let info          = vis.attributesData[i]
                let marriageRow   = vis.marriageData[i]
                let marriageValue = marriageRow.reduce((x, y) => x + y, 0)
                let businessRow   = vis.businessData[i]
                let businessValue = businessRow.reduce((x, y) => x + y, 0)

                // console.log(info)

                // compile data
                let family = {
                    "index": i,
                    "name": info.Family,
                    "allRelations": businessValue + marriageValue,
                    "businessTies": businessValue,
                    "businessValues": businessRow,
                    "marriages": marriageValue,
                    "marriageValues": marriageRow,
                    "numberPriorates": info.Priorates,
                    "wealth": info.Wealth
                }

                // add to display data
                vis.displayData.push(family)
            }
        )

        vis.wrangleData();
    }

    selectCategory(category){
        let vis = this;
        vis.selectedCategory = category;
        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // get selected category and sort data according to that, highest to lowest
        if(vis.selectedCategory === "index"){
            vis.displayData = vis.displayData.sort((a,b) => {
                return a[vis.selectedCategory] - b[vis.selectedCategory]
            })
        } else{
            vis.displayData = vis.displayData.sort((a,b) => {
                return b[vis.selectedCategory] - a[vis.selectedCategory]
            })
        }

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        vis.rows = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData, vis.key)

        // create 1 group/row for each family
        vis.groups = vis.rows
            .enter()
            .append("g")
            .attr("class", "matrix-row")
            .merge(vis.rows)

        vis.groups
            .transition()
            .duration(transitionTime)
            .attr("transform", (d,i)=> {

                // grab correct index of each family in the sorted array
                let familyName = vis.key(d)
                let index = vis.displayData.findIndex(item => item.name === familyName)

                // translate each family by the correct amount using the updated index
                return "translate(0," + (vis.margin.top + index*(vis.cellHeight + vis.cellPadding)) + ")"
            })

        // left labels
        vis.groups
            .append("text")
            .attr("class", "leftLabels")
            .text(d=>d.name)
            .attr("transform", `translate(0,${(vis.cellWidth + vis.cellPadding)/2 + 50})`)

        // top labels
        vis.topLabels = vis.svg.selectAll(".topLabels")
            .data(vis.attributesData)

        vis.topLabels.enter()
            .append("text")
            .attr("class", "topLabels")
            .merge(vis.topLabels)
            .text(d=>d.Family)
            .attr("text-anchor", "start")
            .attr("transform", (d,i) => {
                return "translate(" + (100 + i*(vis.cellWidth + vis.cellPadding) + (vis.cellWidth + vis.cellPadding)/2) +"," + (vis.margin.top+30) + ") rotate(270)"
            })

        // upper triangle paths for marriage ties
        vis.trianglePath = vis.groups.selectAll(".triangle-path-upper")
            .data(d=>d.marriageValues);

        vis.trianglePath
            .enter()
            .append("path")
            .attr("class", "triangle-path-upper")
            .attr("d", function(d, index) {

                let x = (vis.cellWidth + vis.cellPadding) * index;
                let y = 0;

                return 'M ' + x +' '+ y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' z';
            })
            .attr("fill", function(d){
                if(d === 0) return vis.noTiesColor;
                else return vis.marriageColor
            })
            .attr("transform", "translate(100, 50)");

        // lower triangle paths for business ties
        vis.trianglePath2 = vis.groups.selectAll(".triangle-path-lower")
            .data(d=>d.businessValues);

        vis.trianglePath2
            .enter()
            .append("path")
            .attr("class", "triangle-path-lower")
            .attr("d", function(d, index) {

                let x = (vis.cellWidth + vis.cellPadding) * index;
                let y = 0;

                return 'M ' + x +' '+ y + ' l 0 ' + vis.cellHeight + ' l ' + vis.cellHeight + ' 0 z';
            })
            .attr("fill", function(d){
                if(d === 0) return vis.noTiesColor;
                else return vis.businessColor
            })
            .attr("transform", "translate(100, 50)");
    }
}