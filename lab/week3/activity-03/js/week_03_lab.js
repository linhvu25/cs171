
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataManipulation();

// create function
function dataManipulation() {

	// get selected category
	let selectBox = document.getElementById("attraction-category");
	let selectedValue = selectBox.options[selectBox.selectedIndex].value;

	// initialize array
	let attractions;

	// if user selects "all attractions"
	if (selectedValue === "all") {
		attractions = attractionData;
	} else {
		// otherwise filter for appropriate category
		attractions = attractionData.filter( item => item.Category === selectedValue);
	}

	// sort ascending by number of visitors
	attractions.sort(function (a, b) {
		return a.Visitors - b.Visitors;
	})

	// set number of top attractions we want to visualize
	let top_n = 5;

	// filter for top attractions in terms of visitors
	let topAttractions = attractions.filter( (value, index) => {

		return (index < top_n);

	});

	// this also works!
	// let topAttractions = attractions.slice(0, top_n);

	// create bar chart
	renderBarChart(topAttractions);
}