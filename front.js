function createLogin(username, password, email) {
	var xhr = new XMLHttpRequest();

	xhr.open('POST', '/api/create');
	xhr.send(JSON.stringify({username: username, password: password, email: email}));
}

