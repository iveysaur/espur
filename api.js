var url = require('url');

var User = require('./user');

var endpoints = {};

endpoints["user"] = require("./api/user");
endpoints["question"] = require("./api/question");

module.exports = function (request, response, body) {
	var path = url.parse(request.url).pathname;
	var args = path.split("/");
	var method = request.method.toLowerCase();
	var sessionid = request.headers["x-x"] || "";
	console.log(sessionid);
	console.log(request.headers);

	if (args[1] != "api")
		return do404(response);

	// chop off first two elements, , api
	args.splice(0, 2);

	if (!endpoints[args[0]])
		return do404(response);

	var json = null;

	if (body && args[2] != "upload") {
		console.log(body);
		try {
			json = JSON.parse(body);
		} catch (e) {
			// not valid JSON
			console.log(e);
		}
	}

	var callback = function (err, result, headers) {
		if (err) {
			console.log(err);
			console.trace();
			response.writeHead(500);
			response.end(JSON.stringify(err));
		} else {
			response.writeHead(200, headers || {
				"Cache-Control": "no-cache"
			});
			response.end(JSON.stringify(result));
		}
	}

	request.body = body;
	request.args = args;

	var endpoint = endpoints[args[0]]['public_'+method+'_'+args[1]];
	if (endpoint) {
		return endpoint(request, json, callback);
	}

	if (endpoint = endpoints[args[0]][method + "_" + args[1]]) {
		var s = sessionid.split(',');
		User.verifyAuth(s[0], s[1], function(success, userobj) {
			if (success) {
				request.userobj = userobj;
				endpoint(request, json, callback);
			} else {
				console.log("Auth failed: " + sessionid);
				do404(response);
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

