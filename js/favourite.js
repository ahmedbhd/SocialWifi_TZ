function loadDate(){
	var url;

	url = 'http://social-wifi.000webhostapp.com/tizen/services.php?action=selectfav&id_user='+sessionStorage.getItem('iduser');

	console.log('URL : ' + url);
	$.getJSON(url, function(jsonData) {
		console.log(jsonData);
		for(var k in jsonData){
			
			

			 var ul = document.getElementById("action-list");
			  var li = document.createElement("li");
			  li.setAttribute("id", jsonData[k]['id_loc']);

			  li.appendChild(document.createTextNode(jsonData[k]['desc_loc']));
			  li.setAttribute( "onclick", "javascript:showdetail('"+jsonData[k]['id_loc']+"');" );
			  ul.appendChild(li);
		}
		
	});
}

loadDate()

function showdetail(id) {
	console.log(id);
	sessionStorage.setItem('idloc', id);
	window.location.assign("detail.html");
}

