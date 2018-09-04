function initMap() {
	let map;
	let markers = [];

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 53.145472, lng: -6.064194 },
		zoom: 15
	});

	places.forEach(function(place){
		markers.push(new google.maps.Marker({
			position: place.location,
			title: place.name,
			animation: google.maps.Animation.DROP
		}));
	});

	displayMarkers(markers, map);
}


function displayMarkers(markers, map) {
	let bounds = new google.maps.LatLngBounds();

	markers.forEach(function(marker){
		marker.setMap(map);
		bounds.extend(marker.position);
	});

	map.fitBounds(bounds);

}

//show list of markers

//hide list of markers

//populate info window