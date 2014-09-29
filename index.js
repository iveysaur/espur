var app = require('http').createServer(handler);
var fs = require('fs');
var url = require('url');

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
}

