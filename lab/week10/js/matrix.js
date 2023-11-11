class Matrix {
    constructor(parentElement, marriageData, businessData, attributesData) {
        this.parentElement  = parentElement;
        this.marriageData   = marriageData;
        this.businessData   = businessData;
        this.attributesData = attributesData;
        this.displayData    = [];

        this.cellHeight    = 20;
        this.cellWidth     = 20;
        this.cellPadding   = 10;
        this.marriageColor = "#C3B1E1";
        this.businessColor = "#FFAC1C";
        this.noTiesColor   = "lightgrey";

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
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.bottom + vis.margin.top)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.wrangleData();

    }
    wrangleData() {
        let vis = this;

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
        console.log("display", vis.displayData)
        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // create rows for families
        vis.rows = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData)

        vis.groups = vis.rows
            .enter()
            .append("g")
            .attr("class", "matrix-row")
            .attr("transform", (d,i)=> {
                return "translate(0," + i*(vis.cellHeight + vis.cellPadding) + ")"
            })

        // vertical labels
        vis.groups
            .append("text")
            .text(d=>d.name)
            .attr("transform", "translate(0,50)")

        // horizontal labels
        vis.svg.selectAll(".yLabels")
            .data(vis.attributesData)
            .enter()
            .append("text")
            .text(d=>d.Family)
            .attr("text-anchor", "start")
            .attr("transform", (d,i) => {
                return "translate(" + (100 + i*(vis.cellWidth + vis.cellPadding) + (vis.cellWidth + vis.cellPadding)/2) +", 30) rotate(270)"
            })

        // triangle paths
        vis.trianglePath = vis.groups.selectAll(".triangle-path")
            .data(d=>d.marriageValues);

        vis.trianglePath
            .enter()
            .append("path")
            .attr("class", "triangle-path")
            .attr("d", function(d, index) {
                // Shift the triangles on the x-axis (columns)
                let x = (vis.cellWidth + vis.cellPadding) * index;

                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;

                return 'M ' + x +' '+ y + ' l 0 ' + vis.cellHeight + ' l ' + vis.cellWidth + ' 0 z';
            })
            .attr("fill", function(d){
                if(d === 0) return vis.noTiesColor;
                else return vis.marriageColor
            })
            .attr("transform", "translate(100, 50)");

        vis.trianglePath2 = vis.groups.selectAll(".triangle-path")
            .data(d=>d.businessValues);

        vis.trianglePath2
            .enter()
            .append("path")
            .attr("class", "triangle-path")
            .attr("d", function(d, index) {
                // Shift the triangles on the x-axis (columns)
                let x = (vis.cellWidth + vis.cellPadding) * index;

                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;

                return 'M ' + x +' '+ y + ' l 0' + vis.cellHeight + ' l ' + vis.cellHeight + ' 0 z';
            })
            .attr("fill", function(d){
                if(d === 0) return vis.noTiesColor;
                else return vis.businessColor
            })
            .attr("transform", "translate(100, 50)");
    }
}