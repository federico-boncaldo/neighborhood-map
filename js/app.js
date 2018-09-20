
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
	let self = this;
	self.name = ko.observable(data.name);
}

/**
 * 
 */
let ViewModel = function() {
	let self = this;

	self.placesList = ko.observableArray([]);
	self.markers = createMarkers();
	
	places.forEach(function(place) {
		self.placesList.push(new Place(place));
	});

	displayMarkers(self.markers, places);

	self.query = ko.observable("");

	self.search = function() {
		self.placesList.removeAll();
		hideMarkers(self.markers);

		places.forEach(function(place){
			if(place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0){
				self.placesList.push(place);
			}
		});

		self.placesList.sort();
		displayMarkers(self.markers, self.placesList());

	};

	self.animateMarker = function(data, event) {
		let found = false;
		self.markers.forEach(function(marker){
			marker.setIcon(makeMarkerIcon('00ffff'));
			if(marker.title == data.name()){
				marker.setIcon(makeMarkerIcon('f0ffff'));
				populateInfoWindow(marker);
				found = true;
			}
		});

		if(!found)
			alert("Marker not found");
	};

}

ko.applyBindings(new ViewModel());