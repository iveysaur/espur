var app = require('http').createServer(handler);
var fs = require('fs');
var url = require('url');

var upload = require('./upload');
var api = require('./api');

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
		return;
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

