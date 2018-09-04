
//list of styles
let styles = [];


//list of places
let places = [
      {name: 'Wicklow Mountains', location: {lat: 53.081805, lng: -6.393859}},
      {name: 'Glendalough', location: {lat: 53.00363, lng: -6.36264}},
      {name: 'Powerscourt House & Gardens', location: {lat: 53.184251, lng: -6.186633}},
      {name: 'Victor\'s Way Sculpture Garden', location: {lat: 53.085444, lng: -6.219073}},
      {name: 'The Happy Pear', location: {lat:  53.145472, lng: -6.064194 }},
];

/**
 * Model and logic of the application
 * @param data the place we want to manage
 */
let Place = function(data) {
	this.name = ko.observable(data.name);
}

/**
 * 
 */
let ViewModel = function() {

	let placesList = ko.observableArray([]);
	places.forEach(function(place) {
		this.placeList.push(new Place(place));
	})

}