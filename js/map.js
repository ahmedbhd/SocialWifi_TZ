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

	url = 'http://localhost/android/services.php?action=selectloc';

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
		for(var k in jsonData){
			var el = document.createElement('div');
			el.className = 'marker';
			
			var div = document.createElement("div")
			var h3 = document.createElement("h3")
			var title = document.createTextNode(jsonData[k]['desc_loc']);
			var p = document.createElement("p");
			var pw = document.createTextNode(jsonData[k]['wifi_pass']);
			h3.appendChild(title);
			p.appendChild(pw);
			div.appendChild(h3);
			div.appendChild(pw);
			
			var id = jsonData[k]['id_loc'];
			div.setAttribute( "onclick", "javascript:showdetail('"+id+"');" );
			
			  // make a marker for each feature and add to the map
			  new mapboxgl.Marker(el)
			  .setLngLat([jsonData[k]['lng'], jsonData[k]['lat']])
			  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
			  .setDOMContent(div))
			  .addTo(map);
			  
		}
		
	});
}

loadDatatable();

function ajouterloc() {
	
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
			var ssid = document.getElementById('ssid').value;
			var pw= document.getElementById('pw').value;
			
			
			var url;

			url = 'http://localhost/android/services.php?action=addloc&desc='+ssid+'&pw='+pw+'&lat='+lat+'&lng='+lng+'&img=null';

			console.log('URL : ' + url);
			$.get(url, function(data) {
				modal.style.display = "none";
				window.location.assign("map.html");
			});
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

function showdetail(id) {
	console.log(id);
	sessionStorage.setItem('idloc', id);
	window.location.assign("detail.html");
}
