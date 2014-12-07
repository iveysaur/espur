var database = require('../database');
var bcrypt = require('bcrypt');
var crypto = require("crypto");

exports.post_create = function(request, response, args, body, callback) {
	database.query("SELECT username FROM users WHERE username = '" + database.escape(body.username) + "'", function(err, rows) {
		if (rows.length != 0) return callback(null, false);
		generatePass(body.password, function(err, password) {
			var authkey = generateAuthkey(body.username);

			database.query("INSERT INTO users (username, email, password) VALUES ('" + database.escape(body.username) + "','" + database.escape(body.email) + "','" + password + "','" + database.escape(authkey) + "')");
			callback(null, true);
		});
	res.end();
	});
}

exports.post_login = function(request, response, args, body, callback) {
	database.query("SELECT id,password,authkey FROM users WHERE username = '" + database.escape(body.username) + "'", function(err, rows) {
		bcrypt.compare(body.password, rows[0].password, function(err,match) {
			if (err || !match)
				return callback(null, false);
			var sessionid = rows[0].id + "," + rows[0].authkey;
			return callback(null, sessionid, {
				"Set-Cookie": "D=" + sessionid + "; Path=/; Expires=Wed, 09 Jun 2021 10:18:14 GMT",
				"Cache-Control": "no-cache"
			});
		});
	});
}

function generatePass(password, callback) {
	bcrypt.hash(pass, 11, callback);
}

exports.generateAuthkey = function(user) {
	return user.toString() + crypto.randomBytes(20).toString("hex");
}

