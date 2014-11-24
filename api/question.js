var database = require('../database');

exports.get_answer = function(request, response, args, body, callback) {
	var rnd = Math.round(Math.random() * 1) + 1;
	database.query("SELECT * FROM answers WHERE categoryid = " + rnd + " ORDER BY RAND() LIMIT 4", callback);
}

exports.post_upload = function(request, response, args, body, callback) {
	upload.upload(body, function(err, file) {
		callback(null, file);
	});
}
