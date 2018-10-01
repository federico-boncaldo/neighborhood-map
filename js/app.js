
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
 * @param { } [varname] [description]
 * @param { } [varname] [description]
 */
let Place = function(name, display, favorite) {
	let self = this;
	self.name = ko.observable(name);
	self.display = ko.observable(display);
	self.favorite = ko.observable(favorite);
}

/**
 * 
 */
let ViewModel = function() {
	let self = this;

	self.placesList = ko.observableArray([]);
	self.markers = createMarkers();
	
	places.forEach(function(place) {
		self.placesList.push(new Place(place.name, true, false));
	});

	self.placesList.sort();

	//the array of places is passed by providing the content of placesList observable array
	displayMarkers(self.markers, self.placesList());

	self.query = ko.observable("");
	/**
	 * Display only the places that have the query string which matches 
	 * part of the title or the entire title.
	 */
	self.search = function() {
		hideMarkers(self.markers);

		self.placesList().forEach(function(place){
			place.display(false)
			if(place.name().toLowerCase().indexOf(self.query().toLowerCase()) >= 0){
				place.display(true);
			}
		});

		displayMarkers(self.markers, self.placesList());

	};


	/**
	 * Animate the markes which is clicked
	 * @param  {[type]} data  [description]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	self.animateMarker = function(data, event) {
		let found = false;
		self.markers.forEach(function(marker){
			marker.setIcon(makeMarkerIcon('00ffff'));
			marker.setAnimation(null);
			if(marker.title == data.name()){
				marker.setIcon(makeMarkerIcon('f0ffff'));
				marker.setAnimation(google.maps.Animation.BOUNCE);
				populateInfoWindow(marker);
				found = true;
			}
		});

		if(!found)
			alert("Marker for " + data.name() + "not found");
	};

}

ko.applyBindings(new ViewModel());