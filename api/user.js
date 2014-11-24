var database = require('../database');

exports.post_create = function(request, response, args, body, callback) {
	database.query("SELECT username FROM users WHERE username = '" + database.escape(data.username) + "'", function(err, rows) {
		if (rows.length == 0) {
			database.query("INSERT INTO users (username, email, password) VALUES ('" + database.escape(data.username) + "','" + database.escape(data.email) + "','" + database.escape(data.password) + "')");
			callback(null, true);
		}
		else {
			callback(null, false);
		}
	res.end();
	});
}

exports.post_login = function(request, response, args, body, callback) {
	database.query("SELECT username FROM users WHERE username = '" + database.escape(data.username) + "' AND password = '" + database.escape(data.password) + "'", function(err, rows) {
		if (rows.length > 0) {
			callback(null, true);
		}
		else {
			callback(null, false);
		}
	res.end();
	});
}

