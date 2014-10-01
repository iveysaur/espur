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
	fs.readFile(__dirname + '/' + path,
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
	});

	var body = '';
	req.on('data', function (data) {
		body += data.toString();
		if (body.length > 1024*1024) {
			req.connection.destroy();
		}
	});
	req.on('end', function () {
		try {
			data = JSON.parse(body);
			database.query("INSERT INTO users (username, email, password) VALUES ('" + database.escape(data.username) + "','" + database.escape(data.email) + "','" + database.escape(data.password) + "')");
		} catch (e) {}
	});
}

