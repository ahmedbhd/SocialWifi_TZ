
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

/* ==================== Upload Image =========================*/
var files;
var downloadlink = null;
function handleFileSelect(evt) {
    files = evt.target.files; // FileList object
	console.log(files);
	var f = files[0];
	var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  
  function uploadimage(){
		console.log(files)
			var ref = firebase.database().ref();
			
			 // Create a root reference
		    var storageRef = firebase.storage().ref();
		    
	 	    var uploadTask = storageRef.child('locations/01.jpg').put(files[0]);

		 // Register three observers:
		 // 1. 'state_changed' observer, called any time the state changes
		 // 2. Error observer, called on failure
		 // 3. Completion observer, called on successful completion
		 uploadTask.on('state_changed', function(snapshot){
		   // Observe state change events such as progress, pause, and resume
		   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		   console.log('Upload is ' + progress + '% done');
		   switch (snapshot.state) {
		     case firebase.storage.TaskState.PAUSED: // or 'paused'
		       console.log('Upload is paused');
		       break;
		     case firebase.storage.TaskState.RUNNING: // or 'running'
		       console.log('Upload is running');
		       break;
		   }
		 }, function(error) {
			 alert(error);
		   // Handle unsuccessful uploads
		 }, function() {
		   // Handle successful uploads on complete
		   // For instance, get the download URL: https://firebasestorage.googleapis.com/...
			 uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				 console.log('File available at', downloadURL);
				 downloadURL= downloadURL.replace('&', '%26');
				 console.log('File available at &', downloadURL);
				 downloadURL= downloadURL.replace('%', '%25');
				 console.log('File available at %', downloadURL);
				 downloadlink = downloadURL;
				    console.log('File available at last', downloadlink);
				    ajouterloc();
				  });

		 });
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
			h3.innerHTML = jsonData[k]['desc_loc'];
			h3.style='color:black;';
			var p = document.createElement("h4");
			p.innerHTML = jsonData[k]['wifi_pass'];
			p.style='color:gold;';
			div.appendChild(h3);
			div.appendChild(p);
			
			var id = jsonData[k]['id_loc'];
			div.setAttribute( "onclick", "javascript:showdetail('"+id+"');" );
			div.setAttribute( "style", "text-align:center" );
			var pos = {
			        lat: parseFloat (jsonData[k]['lat']),
			        lng:  parseFloat (jsonData[k]['lng'])
			      };
			
/*			var contentString = '<div style="text-align:center" id="content">'+
		      ' <span class="wifname" style=" color: black;>'+
	  		 	'<i class="fas fa-wifi"></i>  <span id="ssid"> '+jsonData[k]['desc_loc']+'</span>'+
	  	  		 '</span><br>'+
	  	  		 
	  	   		 '<span class="wifpassword" style=" color: black;">'+
	  	  		 	'<i class="fas fa-unlock-alt"></i>      <span id="pass">'+jsonData[k]['wifi_pass']+'</span> '+
	  	  		 '</span> '+
		      '</div>';
*/
				
		  
			  var marker = new google.maps.Marker({
		    	    position: pos,
		    	    map: map,
		    	    title: jsonData[k]['desc_loc'],
		    	    draggable: false,
		    	    icon : "./images/mapicon.png"
		    	  });
			  
			  addInfoWindow(marker, div);

		}
		
	});
}

function addInfoWindow(marker, message) {

    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
    });
}
loadDatatable();

function addlocation (){
	if (files!=null) 
		uploadimage();
	else {
		ajouterloc();
	}
}

function ajouterloc() {
	
	var lat = null;
	var lng = null;
	var ssid = document.getElementById('wifinameId').value;
	var pw= document.getElementById('wifipassword').value;
	
	if (ssid.length === 0 || ssid.trim()==='') {
		showToast("SSID can't be empty!");
		return ;
	}
	
	if ( pw.trim()==='' || pw.length < 8) {
		showToast("Invalid Password!");
		return ;
	}
		/*navigator.geolocation.getCurrentPosition(function(position) {
			
			// sets default position to your position
			lat = position.coords.latitude;
			lng = position.coords.longitude;*/
			
			lat = 35;
			lng = 10
			
		    //console . log ( 'Latitude: ' + position . coords . latitude   + 'Longitude: ' + position . coords . longitude );   

			var url;

			url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=addloc&desc='+ssid+'&pw='+pw+'&lat='+lat+'&lng='+lng+'&img='+downloadlink+'&userid='+sessionStorage.getItem("iduser");

			console.log('URL : ' + url);
			$.get(url, function(data) {
				modal.style.display = "none";
				window.location.assign("map.html");
			});
		/*	},
			function(error) {
				console.log("Error: ", error);
				M.toast({html: 'Add Failed!'})
			},{maximumAge: 9999999}
			);
			//iqwerty.toast.Toast('WIFI added!');
		
	*/
	
}

function showToast(msg){
	var x = document.getElementById("snackbar");
	x.innerHTML  = msg;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
		
			map.setZoom(5);
			map.panTo({lat: 35, lng: 10 });
         
		
	}
	if (/\S/.test(filter)) {
		for(var k in locations){
			if (locations[k]['desc_loc'].toUpperCase().indexOf(filter) > -1)
				{
					
						map.setZoom(17);
						map.panTo({lat: parseFloat (locations[k]['lat']), lng:  parseFloat (locations[k]['lng']) });
			        
					
				}
		
		}
				  
	}
	
	
}
