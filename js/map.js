let map;

function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 53.145472, lng: -6.064194 },
		zoom: 11
	});
}

/**
 * [createMarkers description]
 * @return {[type]} [description]
 */
function createMarkers(){
	let markers = []

	let defaultIcon = makeMarkerIcon('00ffff');
	let highlightedIcon = makeMarkerIcon('f0ffff');

	places.forEach(function(place) {
		let marker = new google.maps.Marker({
			position: place.location,
			title: place.name,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon
		});

		marker.addListener('click', function(){
			this.setIcon(highlightedIcon);
			// populateInfoWindow();
		});

		marker.addListener('mouseover', function(){
			this.setIcon(highlightedIcon)
		});		

		marker.addListener('mouseout', function(){
			this.setIcon(defaultIcon)
		});

		markers.push(marker);
	});

	return markers;
}

/**
 * [makeMarkerIcon description]
 * @param  {[type]} markerColor [description]
 * @return {[type]}             [description]
 */
function makeMarkerIcon(markerColor) {
let markerImage = new google.maps.MarkerImage(
  'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
  '|40|_|%E2%80%A2',
  new google.maps.Size(21, 34),
  new google.maps.Point(0, 0),
  new google.maps.Point(10, 34),
  new google.maps.Size(21,34));
return markerImage;
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