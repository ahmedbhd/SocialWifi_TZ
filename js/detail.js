mapboxgl.accessToken = 'pk.eyJ1IjoiZ2hhc3NlbmFiIiwiYSI6ImNqbmFtNTFpNTcxeXUza254bmdnOHUzaXYifQ.b2C0rFd7X_Fi3tg6eAr7MQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [10, 35], // starting position
    zoom: 5 // starting zoom
});

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));


function loadDatatable() {
	
	var url;

	url = 'http://localhost/android/services.php?action=selectaloc&idloc='+sessionStorage.getItem('idloc');

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
		for(var k in jsonData){
			
			document.getElementById("ssid").innerText = jsonData[k]['desc_loc'];
			document.getElementById("pass").innerText = jsonData[k]['wifi_pass'];

			var el = document.createElement('div');
			el.className = 'marker';
			  // make a marker for each feature and add to the map
			  new mapboxgl.Marker(el)
			  .setLngLat([jsonData[k]['lng'], jsonData[k]['lat']])
			  .addTo(map);
			  
			 document.getElementById("direction").onclick=function(){getRoute([jsonData[k]['lat'], jsonData[k]['lng']] )};
		}
		
	});
}

loadDatatable();


function getRoute(end) {
	 
	console.log("Loading route");

	  
	  	var lat = null;
		var lng = null;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var locationMarker = null;
				if (locationMarker){
				  // return if there is a locationMarker bug
				  return;
				}

				// sets default position to your position
				lat = position.coords["latitude"];
				lng = position.coords["longitude"];
				
				var l = parseFloat (end [0] );
				var ln = parseFloat (end [1] );
				if (lat != null) {
					
				var e = [l, ln];
				var start = [lat, lng];
				
				//var ls = new mapboxgl.LngLat(lat, lng);
				//var le = new mapboxgl.LngLat(l, ln);

				console.log(start);
				console.log(e);
				var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + lat + ',' + lng + ';' + e[0] + ',' + e[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
				  $.ajax({
				    method: 'GET',
				    url: directionsRequest,
				  }).done(function(data) {
				    var route = data.routes[0].geometry;
				    map.addLayer({
				      id: 'route',
				      type: 'line',
				      source: {
				        type: 'geojson',
				        data: {
				          type: 'Feature',
				          geometry: route
				        }
				      },
				      paint: {
				        'line-width': 2
				      }
				    });
				    // this is where the code from the next step will go
				  });
				}
			},
			function(error) {
				console.log("Error: ", error);
			},
				{
					enableHighAccuracy: true
				}
			);
			}
		else {
			console.log('allow location');
		}
	  
	}
