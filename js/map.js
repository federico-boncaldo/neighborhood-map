let map;

let infowindow; 

function initMap() {

	infowindow = new google.maps.InfoWindow();
	
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
	let markers = [];

	const defaultIcon = makeMarkerIcon('00ffff');
	const highlightedIcon = makeMarkerIcon('f0ffff');

	places.forEach(function(place) {
		let marker = new google.maps.Marker({
			position: place.location,
			title: place.name,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon
		});

		markers.push(marker);

		marker.addListener('click', function(){
			this.setIcon(highlightedIcon);
			populateInfoWindow(this);
		});

		marker.addListener('mouseover', function(){
			this.setIcon(highlightedIcon)
		});		

		marker.addListener('mouseout', function(){
			this.setIcon(defaultIcon)
		});

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
			if(place.name() == marker.title)
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

/**
 * [populateInfoWindow description]
 * @param  {[type]} marker     [description]
 * @return {[type]}            [description]
 */
function populateInfoWindow(marker) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            pano, panoramaOptions);
        } else {
          pano.innerHTML = 'No Street View Found';
          pano.className = 'no-pano';
        }
      }

      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);

      getWikipediaLinks(marker.title);
    }
}

/**
 * [getWikipediaLinks description]
 * @param  {[type]} title [description]
 * @return {[type]}       [description]
 */
function getWikipediaLinks(title){

  let $wikiLink = $('#wikipedia-link');
  
  //the search will retrieve only one article max. for each location
  let wikipediaURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ title +"&limit=1&profile=normal&format=json&callback=wikiCallBack" ;

  let wikiRequestTimeout = setTimeout(function(){
      $wikiLink.text("Failed to get wikipedia article");
  }, 8000);

  $.ajax({
    url: wikipediaURL,
    dataType: "jsonp",
    success: function(response){
      let articleList = response[1];
      (articleList.length != 0) ? $wikiLink.append("<h4>Wikipedia article</h4>") : $wikiLink.text("Wikipedia article not present");

      for(let article of articleList){
        let url = "https://en.wikipedia.org/wiki/" + article;
        $wikiLink.append('<li><a href="' + url + '">' +
            article + '</a></li>');
      }

      clearTimeout(wikiRequestTimeout);
    }
  }).fail(function(jqXHR, textStatus){
    $wikiLink.text("Wikipedia request failed: " + textStatus)
  });
}