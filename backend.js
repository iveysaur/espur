var app = require('http').createServer(handler);
var fs = require('fs');
var url = require('url');

var database = require('./database');
database.init();

var api = require('./api');
var index = require('./index');

app.listen(1299);

function handler (req, res) {
	var path = url.parse(req.url).pathname;

	if (path == '/') {
		return index(res);
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
			api(req, res, body);
		} catch (e) {
			console.log(e);
			res.writeHead(500);
			res.end();
		}
	});
}

