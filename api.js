var url = require('url');

var endpoints = {};

endpoints["user"] = require("./api/user");
endpoints["question"] = require("./api/question");

module.exports = function (request, response, body) {
	var path = url.parse(request.url).pathname;
	var args = path.split("/");

	if (args[1] != "api")
		return do404(response);

	// chop off first two elements, , api
	args.splice(0, 2);

	var json = null;

	if (body && args[2] != "upload") {
		try {
			json = JSON.parse(body);
		} catch (e) {
			// not valid JSON
		}
	}

	var method = request.method.toLowerCase();

	if (endpoints[args[0]] && endpoints[args[0]][method + "_" + args[1]]) {
		endpoints[args[0]][method + "_" + args[1]](request, response, args, body, function (err, result, headers) {
			if (err) {
				response.writeHead(500);
				response.end(JSON.stringify(err));
			} else {
				response.writeHead(200, headers || {
					"Cache-Control": "no-cache"
				});
				response.end(JSON.stringify(result));
			}
		});
	} else {
		do404(response);
	}
}

function do404(response) {
	response.writeHead(404);
	response.end("404");
}

