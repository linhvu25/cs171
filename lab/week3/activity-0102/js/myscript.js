// create data structure
let amusementRides = [
    {"id": "123abc", "name" : "Disneyland", "price": 50,
        "open": ["Monday", "Wednesday"], "limited_access": true},
    {"id": "123abc", "name" : "Disney World", "price": 100,
        "open": ["Tuesday", "Friday"], "limited_access": true},
    {"id": "123abc", "name" : "Six Flags", "price": 35,
        "open": ["Monday", "Saturday"], "limited_access": false},
];

// call function
let amusementRidesDouble = doublePrices(amusementRides);
// let debug = debugAmusementRides(amusementRides);

// implement function for activity 2
function doublePrices(amusementRides) {

    // double the price of all parks
    for(let i = 0; i < amusementRides.length; i++){
        amusementRides[i].price *= 2;
    }

    // except for the 2nd park
    amusementRides[1].price = amusementRides[1].price/2;

    // return
    return amusementRides;
}

// implement function for activity 2
function debugAmusementRides(amusementRides){

    // create string
    let park_info = '';

    // add park info to string
    amusementRides.forEach(function(park) {
        park_info += "Name: " + park.name + "; Price: " + park.price + "\n";
    })

    return park_info;
}

// activity 2: print in console
console.log(amusementRidesDouble);
// console.log(debug);

// activity 1
console.log(amusementRides[0].name);
console.log(amusementRides[1].open);
console.log(amusementRides[1].open[0]);
console.log(0.5*amusementRides[2].price);

park_info = debugAmusementRides(amusementRides);

document.getElementById("content-1").innerHTML = '<h1>amusement parks!</h1>relevant info:';
document.getElementById("content-2").innerHTML = park_info;