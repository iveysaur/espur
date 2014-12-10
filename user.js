var Database = require('./database');
var bcrypt = require('bcryptjs');
var crypto = require("crypto");

exports.verifyAuth = function(userid,authkey,callback) {
	this.getUserProfile(userid, function(err,rows) {
		if (err || rows.length < 1 || !rows[0]) return callback(false);
		callback(authkey == rows[0].authkey, rows[0]);
	});
}

exports.getUserProfile = function(userid,callback) {
	Database.query("SELECT * FROM `users` WHERE `id` = " + ~~(userid), callback);
}

exports.validUsername = function(username) {
	if (username)
		return true;
	return false;
}

exports.generatePass = function(password, callback) {
	bcrypt.hash(password, 11, callback);
}

exports.generateAuthkey = function(user) {
	return user.toString() + crypto.randomBytes(20).toString("hex");
}
