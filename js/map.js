let map;
let infowindow;

/**
 * @description Callback function, create the map and the infowindow object
 */
function initMap() {

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 53.085444, lng: -6.219073 },
    zoom: 9.5
  });
}

/**
 * @description Error function in case of issues during map loading
 */
function mapError() {
  //add a class to the map div in order display a different message and style
  //the page differently
  let mapDiv = document.getElementById("map");
  mapDiv.className = "no-map";
  mapDiv.innerHTML = "There was a problem while downloading the map.<br> " +
    "We're sorry for the inconvenience.";
}

/**
 * @description Add one marker for each location and store it in an array
 * @return array All the location markers
 */
function createMarkers(){
  let markers = [];

  const defaultIcon = makeMarkerIcon("00ffff");
  const highlightedIcon = makeMarkerIcon("f0ffff");

  places.forEach(function(place) {
    let marker = new google.maps.Marker({
      position: place.location,
      title: place.name,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon
    });

    markers.push(marker);

    marker.addListener("click", function(){
      marker.setIcon(highlightedIcon);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      populateInfoWindow(marker);
    });

    marker.addListener("mouseover", function(){
      marker.setIcon(highlightedIcon);
    });

    marker.addListener("mouseout", function(){
      marker.setIcon(defaultIcon);
      marker.setAnimation(null);
    });

  });

  return markers;
}

/**
 * @description Modify the marker image according to the color provided
 * @param  string markerColor the color code that will be used
 * @return object markerImage the modified image of the marker
 */
function makeMarkerIcon(markerColor) {
  let markerImage = new google.maps.MarkerImage(
    "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" +
    markerColor + "|40|_|%E2%80%A2",
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

/**
 * @description Show the markers on the map according to the display status of
 * the place
 * @param  array markers
 * @param  array placesList
 * @return array markers markers to display
 */
function displayMarkers(markers, placesList) {

  // let bounds = new google.maps.LatLngBounds();

  placesList.forEach(function(place){
    markers.forEach(function(marker){
      if(
          place.name() === marker.title &&
          place.display()
        ) {
        marker.setMap(map);
      }
      // bounds.extend(marker.position);
    });
  });

  // map.fitBounds(bounds);
  return markers;
}

/**
 * @description Hide all markers on the map
 */
function hideMarkers(markers){

  markers.forEach(function(marker){
    marker.setMap(null);
  });
}

/**
 * @description Add panorama of the location and wiki article to the infowindow
 * marker and display it. Otherwise inform the user of the absence of the
 * street view image
 * @param object marker
 */
function populateInfoWindow(marker) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener("closeclick", function() {
        infowindow.marker = null;
      });
      let streetViewService = new google.maps.StreetViewService();
      let radius = 50;

      infowindow.setContent("<h3>" + marker.title + "</h3>" +
      "<div id='pano'></div> <div id='wikipedia-link'></div>");

      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get
      // a panorama from that and set the options
      function getStreetView(data, status) {
        let pano = document.getElementById("pano");
        if (status === google.maps.StreetViewStatus.OK) {
          let nearStreetViewLocation = data.location.latLng;
          let heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);

            let panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          let panorama = new google.maps.StreetViewPanorama(
            pano, panoramaOptions);
        } else {
          pano.innerHTML = "No Street View Found";
          pano.className = "no-pano";
        }
      }

      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(
        marker.position, radius, getStreetView);

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);

      getWikipediaLinks(marker.title);
    }
}

/**
 * @description Display one wikipedia article for each location if present
 * inside the infowindow
 * @param string title location name
 */
function getWikipediaLinks(title){

  let $wikiLink = $("#wikipedia-link");

  //the search will retrieve only one article max. for each location
  let wikipediaURL = "https://en.wikipedia.org/w/api.php?" +
  "action=opensearch&search=" + title +
  "&limit=1&profile=normal&format=json&callback=wikiCallBack" ;

  let wikiRequestTimeout = setTimeout(function(){
      $wikiLink.text("Failed to get wikipedia article");
  }, 8000);

  $.ajax({
    url: wikipediaURL,
    dataType: "jsonp",
    success: function(response){
      let articleList = response[1];
      (articleList.length !== 0) ?
        $wikiLink.append("<h4>Wikipedia article</h4>") :
        $wikiLink.text("Wikipedia article not present");

      articleList.forEach(function(article){
        let url = "https://en.wikipedia.org/wiki/" + article;
        $wikiLink.append("<li><a href='" + url + "'>" +
            article + "</a></li>");
      });

      clearTimeout(wikiRequestTimeout);
    }
  }).fail(function(jqXHR, textStatus){
    $wikiLink.text("Wikipedia request failed: " + textStatus +
      " " + jqXHR.status );
  });
}