

function signup() {
	
	var email = document.getElementById('emailId').value;
	var password = document.getElementById('passwordId').value;
	var cpassword = document.getElementById('cpasswordId').value;
	var userName = document.getElementById('usernameId').value;
	
	console.log ('Email : '+email);
	if (email == '') {
		document.getElementById('validEmail').style.display = '';
		document.getElementById('validEmail').innerHTML = "Please fill it ";
	}
	if (userName == '') {
		document.getElementById('validUser').style.display = '';
		document.getElementById('validUser').innerHTML = "Please fill it ";
	}
	if (password == '') {
		document.getElementById('validPassword').style.display = '';
		document.getElementById('validPassword').innerHTML = "Please fill it ";
	}
	if (cpassword == '') {
		document.getElementById('validcPassword').style.display = '';
		document.getElementById('validcPassword').innerHTML = "Please fill it ";
	}

	if (cpassword != password) {
		document.getElementById('validcPassword').style.display = '';
		document.getElementById('validcPassword').innerHTML = "confirm password not equal";
	}
	
	loadDatatable();
}

function loadDatatable() {
	var em = document.getElementById('emailId').value;
	var pw= document.getElementById('passwordId').value;
	
	var urn = document.getElementById('usernameId').value;
	
	var url;

	url = 'http://localhost/android/add_fbuser.php?email='+em+'&username='+urn+'&password='+pw;

	console.log('URL : ' + url);
	$.getJSON(url, function(data) {
		if (data == 1)
			window.location.assign("login.html");
	});
}