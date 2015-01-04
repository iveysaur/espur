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

	var runApi = function () {
		try {
			api(req, res, body);
		} catch (e) {
			console.log(e);
			console.log(e.stack);
			console.trace();
			res.writeHead(500);
			res.end();
		}
	}

	var body = '';
	if (path.indexOf("upload") !== -1) {
		req.pause();
		runApi();
	} else {
		req.on('data', function (data) {
			body += data.toString();
			if (body.length > 1024*1024) {
				req.connection.destroy();
			}
		});
		req.on('end', runApi);
	}
}

