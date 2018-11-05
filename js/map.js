
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.6735494, lng: 10.4066731},
    zoom: 6
  });
  //var infoWindow = new google.maps.InfoWindow({map: map});

  /* var pos = {
	        lat: 36.6735494,
	        lng: 10.4066731
	      };

	      infoWindow.setPosition(pos);
	      infoWindow.setContent('Location found.');
	      map.setCenter(pos);*/

	      function handleEvent(event) {
	          alert(event.latLng.lat());
	    	    //document.getElementById('lat').value = event.latLng.lat();
	    	    //document.getElementById('lng').value = event.latLng.lng();
	    	}

	      /* var marker = new google.maps.Marker({
	    	    position: pos,
	    	    map: map,
	    	    title: "I'm here",
	    	    draggable: true
	    	  });
	      map.setCenter(pos);

	      marker.addListener('dragend', handleEvent); */

  // Try HTML5 geolocation.
  /*if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);

      function handleEvent(event) {
          alert(event.latLng.lat());
    	    //document.getElementById('lat').value = event.latLng.lat();
    	    //document.getElementById('lng').value = event.latLng.lng();
    	}

      var marker = new google.maps.Marker({
    	    position: pos,
    	    map: map,
    	    title: "I'm here",
    	    draggable: true
    	  });

      marker.addListener('dragend', handleEvent);
	  
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }*/
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

var locations;
function loadDatatable() {
	
	var url;

	url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=selectloc';

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
		locations = jsonData;
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
		/*	  new mapboxgl.Marker(el)
			  .setLngLat([jsonData[k]['lng'], jsonData[k]['lat']])
			  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
			  .setDOMContent(div))
			  .addTo(map); */
			var pos = {
			        lat: parseFloat (jsonData[k]['lat']),
			        lng:  parseFloat (jsonData[k]['lng'])
			      };
			
			  var marker = new google.maps.Marker({
		    	    position: pos,
		    	    map: map,
		    	    title: jsonData[k]['desc_loc'],
		    	    draggable: false,
		    	    icon : "./images/mapicon.png"
		    	  });
			  
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

			url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=addloc&desc='+ssid+'&pw='+pw+'&lat='+lat+'&lng='+lng+'&img=null';

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
			iqwerty.toast.Toast('WIFI added!');
		}
	else {
		console.log('allow location');
		iqwerty.toast.Toast('Allow location!');
	}
	
	
}

function showdetail(id) {
	console.log(id);
	sessionStorage.setItem('idloc', id);
	window.location.assign("detail.html");
}

function Search () {
	var input = document.getElementById("myInput");
	var filter = input.value.toUpperCase();
	
	if (filter.length ===0)  {
		map.flyTo({
	        // These options control the ending camera position: centered at
	        // the target, at zoom level 9, and north up.
	        center: [10, 35],
	        zoom: 5,
	        bearing: 0,

	        // These options control the flight curve, making it move
	        // slowly and zoom out almost completely before starting
	        // to pan.
	        speed: 2, // make the flying slow
	        curve: 1, // change the speed at which it zooms out

	        // This can be any easing function: it takes a number between
	        // 0 and 1 and returns another number between 0 and 1.
	        easing: function (t) {
	            return t;
	        }
	    });
	}
	if (/\S/.test(filter)) {
		for(var k in locations){
			if (locations[k]['desc_loc'].toUpperCase().indexOf(filter) > -1)
				{
					map.flyTo({
				        // These options control the ending camera position: centered at
				        // the target, at zoom level 9, and north up.
				        center: [locations[k]['lng'], locations[k]['lat']],
				        zoom: 15,
				        bearing: 0,
		
				        // These options control the flight curve, making it move
				        // slowly and zoom out almost completely before starting
				        // to pan.
				        speed: 2, // make the flying slow
				        curve: 1, // change the speed at which it zooms out
		
				        // This can be any easing function: it takes a number between
				        // 0 and 1 and returns another number between 0 and 1.
				        easing: function (t) {
				            return t;
				        }
				    });
				}
		
		}
				  
	}
	
	
}
