var database = require('../database');
var bcrypt = require('bcryptjs');

var User = require('../user');

exports.public_post_create = function(req, body, callback) {
	if (!User.validUsername(body.username))
		return callback(400, { status: false });

	database.query("SELECT username FROM users WHERE username = '" + database.escape(body.username) + "'", function(err, rows) {
		if (rows.length != 0) return callback(null, false);
		User.generatePass(body.password, function(err, password) {
			var authkey = User.generateAuthkey(body.username);

			database.query("INSERT INTO users (username, email, password, authkey) VALUES ('" + database.escape(body.username) + "','" + database.escape(body.email) + "','" + password + "','" + database.escape(authkey) + "')", function(err, rows) {
				if (err)
					return callback(null, { status: false });

				var sessionid = rows.insertId + "," + authkey;

				callback(null, { status: true, authkey: sessionid, user: rows.insertId });
			});
		});
	});
}

exports.public_post_login = function(req, body, callback) {
	database.query("SELECT id,password,authkey FROM users WHERE username = '" + database.escape(body.username) + "'", function(err, rows) {
		if (!rows[0] || !rows[0].password) return callback(null, { status: false });
		bcrypt.compare(body.password, rows[0].password, function(err,match) {
			if (err || !match)
				return callback(null, { status: false });
			var sessionid = rows[0].id + "," + rows[0].authkey;
			return callback(null, { status: true, authkey: sessionid, user: rows[0].id }, {
				"Set-Cookie": "D=" + sessionid + "; Path=/; Expires=Wed, 09 Jun 2021 10:18:14 GMT",
				"Cache-Control": "no-cache"
			});
		});
	});
}

exports.post_feedback = function(req, body, callback) {
	database.query("INSERT INTO feedback (userid, feedback) VALUES (" + ~~req.userobj.id + ",'" + database.escape(body.feedback) + "')", function(err, rows) {
		if (err) return callback(null, { status: false });
		callback(null, { status: true });
	});
}

