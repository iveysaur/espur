var config = require('./config');
var mysql = require('mysql-libmysqlclient');

var connection = null;
var isConnecting = false;

exports.init = function() {
	if (isConnecting) {
		return;
	}
	isConnecting = true;

	var db = config.database;

	connection = mysql.createConnectionSync();
	connection.connectSync(db.host, db.user, db.password, db.database);

	if (!connection.connectedSync()) {
		console.log("Problem connecting to the database.");
		setTimeout(exports.init, 1000);
	}
	isConnecting = false;
}

exports.query = function(query, callback, args) {
	try {
		connection.query(query, function(err, res) {
			if (err) {
				exports.init(config.database);
				exports.query(query, callback);
				return;
			}
			if (res.fetchAll) {
				res.fetchAll(function(err, res) {
					callback(err, res, args);
				});
			} else if (callback) {
				callback(err, res, args);
			}
		});
	} catch (e) {
		if (e.message.indexOf("Not connected") != -1) {
			exports.init(config.database);
			setTimeout(function() {
				exports.query(query, callback);
			}, 100);
		}
	}
}

exports.escape = function (string) {
	return connection.escapeSync(string);
}
