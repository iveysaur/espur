function createLogin(username, password, email) {
	var xhr = new XMLHttpRequest();

	xhr.open('POST', '/api/create');
	xhr.send(JSON.stringify({username: username, password: password, email: email}));
}

function login(username, password) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			console.log(xhr.responseText);
			switch (xhr.responseText) {
				case "success":
					location.href = "index.html";
					break;
				default:
					break;
			}
		}
	}
	xhr.open('POST', '/api/login');
	xhr.send(JSON.stringify({username: username, password: password}));
}

