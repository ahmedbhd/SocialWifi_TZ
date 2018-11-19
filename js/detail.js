
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.6735494, lng: 10.4066731},
    zoom: 6
});
  
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	  infoWindow.setPosition(pos);
	  infoWindow.setContent(browserHasGeolocation ?
	                        'Error: The Geolocation service failed.' :
	                        'Error: Your browser doesn\'t support geolocation.');
}
var isfav = 1;


function loadDatatable() {
	
	var url;

	url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=selectaloc&idloc='+sessionStorage.getItem('idloc');

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
		for(var k in jsonData){
			
			document.getElementById("ssid").innerText = jsonData[k]['desc_loc'];
			document.getElementById("pass").innerText = jsonData[k]['wifi_pass'];
			console.log(jsonData[k]['img'])
			if (jsonData[k]['img']!=null){
				$("#imgwifi").attr("src",jsonData[k]['img']);
			}
			
			var el = document.createElement('div');
			el.className = 'marker';
			  // make a marker for each feature and add to the map

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
			  google.maps.event.addListener(marker, 'click', function () {
			        getRoute(marker.position )
			        if (marker.getAnimation() !== null) {
			            marker.setAnimation(null);
			          } else {
			            marker.setAnimation(google.maps.Animation.BOUNCE);
			          }
			    });
			  map.setCenter(pos);
		}
		
	});
	
	//check if this location is favourite
	$.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=checkfav&id_loc='+sessionStorage.getItem('idloc')+'&id_user='+sessionStorage.getItem('iduser'), function(result) {
		isfav = result;
		console.log(isfav);
		if (result == 0){
			document.getElementById("favimg").src="./images/emptyheart.png";
		}
	});
}

loadDatatable();


function getRoute(end) {
	
    showToast( "Loading direction!");
	console.log("Loading route");

	  
	  	var lat = null;
		var lng = null;
		
		var markerArray = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;
        
		// Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;
        
        calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map , end);
	  
}

function showToast(msg){
	var x = document.getElementById("snackbar");
	x.innerHTML  = msg;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map , end ) {
      
      
      
     // navigator.geolocation.getCurrentPosition(function(position) {
			
			// sets default position to your position
		/*	lat = position.coords.latitude;
			lng = position.coords.longitude;*/
			
			lat = 36.9045869;
			lng = 10.1866451;
			// First, remove any existing markers from the map.
		      for (var i = 0; i < markerArray.length; i++) {
		        markerArray[i].setMap(null);
		      }

		      // Retrieve the start and end locations and create a DirectionsRequest using
		      // WALKING directions.
		      directionsService.route({
		        origin: {lat :lat,lng : lng},
		        destination: end,
		        travelMode: 'DRIVING'
		      }, function(response, status) {
		        // Route the directions and pass the response to a function to create
		        // markers for each step.
		        if (status === 'OK') {
		          directionsDisplay.setDirections(response);
		          showSteps(response, markerArray, stepDisplay, map);
		        } else {
		          window.alert('Directions request failed due to ' + status);
		        }
		      });
		/*},
			function(error) {
				console.log("Error: ", error);
			},{maximumAge: 9999999}
			);*/
 }
function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      attachInstructionText(
          stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
  }
function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }




function ratingfunc() {
	//ToDo : WebService
	var url;

	$.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=selectratings&loc='+sessionStorage.getItem('idloc'), function(string) {
		console.log(string);
		$('#rating').rating('update', string);
		
		
	});
	$('#rating').on('rating:change', function(event, value, caption) {
		var t = true;

		if (t){
		    console.log(value);
		    //ToDo : WebService
		    var user = sessionStorage.getItem('iduser');
		      $.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=addrate&rate='+value+'&loc='+sessionStorage.getItem('idloc')+'&user='+user, function(string) {
				console.log(string);
				var url;

				$.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=selectratings&loc='+sessionStorage.getItem('idloc'), function(val) {
					console.log(val);
					$('#rating').rating('update', val);
					showToast("Raiting updated!")
					
				});
				
			});
		    t = false;
		}
	});
}

ratingfunc();

function favourite() {
	document.getElementById("favimg").src="./images/emptyheart.png";

	if (isfav == 0){
		$.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=addfavourite&id_loc='+sessionStorage.getItem('idloc')+'&id_user='+sessionStorage.getItem('iduser'), function(result) {
			
			document.getElementById("favimg").src="./images/fullheart.png";
			isfav = 1;
			showToast("Favourite Added!")
		});
	}else {
		$.get('http://social-wifi.000webhostapp.com/tizen/services.php?action=delfavourite&id_loc='+sessionStorage.getItem('idloc')+'&id_user='+sessionStorage.getItem('iduser'), function(result) {
			
			document.getElementById("favimg").src="./images/emptyheart.png";
			isfav = 0;	
			showToast("Favourite deleted!")
		});
	}
}
