
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class StationMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, coords, geoData) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.coords = coords;
		this.geoData = geoData;

		this.initVis();
	}


	/*
	 *  Initialize station map
	 */
	initVis () {
		let vis = this;

		vis.map = L.map('station-map').setView(vis.coords, 13);

		L.Icon.Default.imagePath = 'css/images/';

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		// add marker for each station
		vis.displayData.forEach(row=>{
			let popupContent = "<strong>" + row.name + "</strong>" + "<br>";
			popupContent += row.capacity;

			L.marker([row.lat, row.lon])
				.bindPopup(popupContent)
				.addTo(vis.map);
		})

		// add subway lines
		L.geoJson(vis.geoData, {
			weight: 6,
			style: styleColor
		}).addTo(vis.map);

		function styleColor(feature) {
			return{color: feature.properties.LINE.toLowerCase()}
		}

	}
}

