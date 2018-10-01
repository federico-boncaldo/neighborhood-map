let places = [
      {
        name: "Wicklow Mountains",
        location: {lat: 53.081805, lng: -6.393859}
    },
      {
        name: "Glendalough",
        location: {lat: 53.00363, lng: -6.36264}
    },
      {
        name: "Powerscourt House & Gardens",
        location: {lat: 53.184251, lng: -6.186633}
    },
      {
        name: "Victor's Way Sculpture Garden",
        location: {lat: 53.085444, lng: -6.219073}
    },
      {
        name: "The Happy Pear",
        location: {lat:  53.145472, lng: -6.064194 }
    }
];

/**
 * @description Model and logic of the application
 * @constructor
 * @param string name location name
 * @param boolean display used to display the location during the search
 * @param boolean favorite used to pick favorite locations
 */
let Place = function(name, display, favorite) {
    let self = this;
    self.name = ko.observable(name);
    self.display = ko.observable(display);
    self.favorite = ko.observable(favorite);
};

/**
 * @description Allow the acces to places list and markers.
 * Provide the search and animateMarker features.
 * @constructor
 */
let ViewModel = function() {
    let self = this;

    self.placesList = ko.observableArray([]);
    self.markers = createMarkers();

    places.forEach(function(place) {
        self.placesList.push(new Place(place.name, true, false));
    });

    self.placesList.sort();

    //the array of places is passed by providing the content of placesList
    //observable array
    displayMarkers(self.markers, self.placesList());

    self.query = ko.observable("");
    /**
     * @description Display only the places that have the query string which
     * matches
     * part of the title or the entire title.
     */
    self.search = function() {
        hideMarkers(self.markers);

        self.placesList().forEach(function(place){
            place.display(false);
            if(
                place.name().toLowerCase().indexOf(self.query().toLowerCase())
                >= 0
            ){
                place.display(true);
            }
        });

        displayMarkers(self.markers, self.placesList());

    };


    /**
     * @description Animate the marker of the location
     * @param  observable data the location selected by the user
     */
    self.animateMarker = function(data) {
        let found = false;
        self.markers.forEach(function(marker){
            marker.setIcon(makeMarkerIcon("00ffff"));
            marker.setAnimation(null);
            if(marker.title == data.name()){
                marker.setIcon(makeMarkerIcon("f0ffff"));
                marker.setAnimation(google.maps.Animation.BOUNCE);
                populateInfoWindow(marker);
                found = true;
            }
        });

        if(!found) {
            alert("Marker for " + data.name() + "not found");
        }
    };

};

ko.applyBindings(new ViewModel());