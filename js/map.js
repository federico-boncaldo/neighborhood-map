let map;

function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 53.145472, lng: -6.064194 },
		zoom: 11
	});

	// displayMarkers(places);
}

function createMarkers(){
	let markers = []

	places.forEach(function(place) {
		markers.push(new google.maps.Marker({
			position: place.location,
			title: place.name,
			animation: google.maps.Animation.DROP
		}));
	});

	return markers;
}

/**
 * [displayMarkers description]
 * @param  {[type]} places [description]
 * @return {[type]}        [description]
 */
function displayMarkers(markers, placesList) {
	
	// let bounds = new google.maps.LatLngBounds();

	placesList.forEach(function(place){
		markers.forEach(function(marker){
			if(place.name == marker.title)
				marker.setMap(map);
			// bounds.extend(marker.position);
		});
	});

	// map.fitBounds(bounds);
	return markers
}

/**
 * [hideMarkers description]
 * @return {[type]} [description]
 */
function hideMarkers(markers){
	
	markers.forEach(function(marker){
		marker.setMap(null);
	});
}

//show list of markers

//hide list of markers

//populate info window