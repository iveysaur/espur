var app = require('http').createServer(handler);
var fs = require('fs');
var url = require('url');

var config = require('./config');
var database = require('./database');

database.init();

app.listen(1299);

function handler (req, res) {
	var path = url.parse(req.url).pathname;
	if(path == '/') {
		path = 'index.html';
	}
	pathFirst = path.split('/')[1];
	if (pathFirst != 'api') {
		fs.readFile(__dirname + '/' + path,
			function (err, data) {
				if (err) {
					res.writeHead(500);
					return res.end('Error loading ' + path);
				}
				res.writeHead(200);
				res.end(data);
		});
	}

	var body = '';
	req.on('data', function (data) {
		body += data.toString();
		if (body.length > 1024*1024) {
			req.connection.destroy();
		}
	});
	req.on('end', function () {
		try {
			path = url.parse(req.url).pathname;
			data = JSON.parse(body);
			switch (path) {
				case '/api/create' :
					database.query("SELECT username FROM users WHERE username = '" + database.escape(data.username) + "'", function(err, rows) {
						if (rows.length == 0) {
							database.query("INSERT INTO users (username, email, password) VALUES ('" + database.escape(data.username) + "','" + database.escape(data.email) + "','" + database.escape(data.password) + "')");
							res.write("good");
						}
						res.end();
					});
				return;
				case '/api/login' :
					database.query("SELECT username FROM users WHERE username = '" + database.escape(data.username) + "' AND password = '" + database.escape(data.password) + "'", function(err, rows) {
						if (rows.length > 0) {
							console.log(rows);
							res.write("success");
							res.end();
						}
					});
				return;
			}
		} catch (e) {}
	});
}

