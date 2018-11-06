function loadDate(){
	var url;

	url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=selectfav&id_user='+sessionStorage.getItem('iduser');

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
	
		
		$.each(jsonData, function(i){
			 var templateString = '<div class="card" style="margin-left:auto; margin-right:auto; margin:20px"> <img class="card-img-top" src="images/logowifi.jpg" alt="image" style="margin-left:auto; margin-right:auto;width:5cm;height:5cm"> <div class="card-body"> <h4 class="card-title">'+jsonData[i]['desc_loc']+'</h4> <p class="card-text">'+jsonData[i]['wifi_pass']+'</p></div><a href="javascript:showdetail('+jsonData[i]['id_loc']+')" class="btn btn-primary" style="float:right;border: 5px solid transparent;">Details</a> </div> </div>';
			 $('#favlist').append(templateString);
		})
		
		
	});
}

loadDate()

function showdetail(id) {
	console.log(id);
	sessionStorage.setItem('idloc', id);
	window.location.assign("detail.html");
}

