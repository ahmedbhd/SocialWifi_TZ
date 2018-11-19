function signup() {
	document.getElementById('validEmail').style.display = 'none';
	document.getElementById('validUser').style.display = 'none';
	document.getElementById('validPassword').style.display = 'none';
	document.getElementById('validcPassword').style.display = 'none';

	var email = document.getElementById('emailId').value;
	var password = document.getElementById('passwordId').value;
	var cpassword = document.getElementById('cpasswordId').value;
	var userName = document.getElementById('usernameId').value;
	
	console.log ('Email : '+email);
	if (email == '' || !validateEmail(email)) {
		document.getElementById('validEmail').style.display = '';
		document.getElementById('validEmail').innerHTML = "Please use a valid email ";
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

	url = 'http://social-wifi.000webhostapp.com/tizen/add_fbuser.php?email='+em+'&username='+urn+'&password='+pw;

	console.log('URL : ' + url);
	$.getJSON(url, function(data) {
		console.log(data)
		if (data == 2){
			document.getElementById('validEmail').style.display = '';
			document.getElementById('validUser').style.display = '';

			document.getElementById('validEmail').innerHTML = "Invalid email";
			document.getElementById('validUser').innerHTML = "Invalid username ";

			return ;
		}
		if (data == 3){
			document.getElementById('validEmail').style.display = '';

			document.getElementById('validEmail').innerHTML = "Invalid email";
			return ;
		}
		if (data == 4){
			document.getElementById('validUser').style.display = '';

			document.getElementById('validUser').innerHTML = "Invalid username";
			return ;
		}
		if (data == 1)
			window.location.assign("login.html");
	});
}

function cancel(){
	window.location.href= "login.html";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}