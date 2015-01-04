var database = require('../database');
var upload = require('../upload');

var numCategories = 1;

// Figure out how many different categories we have in the db
database.query("SELECT COUNT(DISTINCT categoryid) FROM answers", function(err, rows) {
	numCategories = rows[0]["COUNT(DISTINCT categoryid)"] - 1;
});

exports.get_answer = function(req, body, callback) {
	var rnd = Math.round(Math.random() * numCategories) + 1;
	database.query("SELECT * FROM answers WHERE categoryid = " + rnd + " ORDER BY RAND() LIMIT 1", function(err, rows) {
		if (err) return callback(err, { status: 500 });

		callback(null, rows[0]);
	});
}

// Rapid prototype
// Definitely needs some optimizations, i.e. not using ORDER BY RAND(),
// and combining the queries into one or two. But it'll work for the testing phase.
exports.get_question = function(req, body, callback) {
	database.query("SELECT * FROM entries WHERE userid != " + (~~req.userobj.id) + " AND id NOT IN(SELECT entry FROM seen WHERE userid = " + (~~req.userobj.id) + ") ORDER BY RAND() LIMIT 1", function (err, rows) {
		if (err) return callback(err);

		// No data meeting the criteria
		if (rows.length < 1)
			return callback(null, { id: -1 });

		var entry = rows[0];
		var answerid = ~~entry.answerid;

		database.query("SELECT * FROM answers WHERE id = " + answerid, function (err, rows) {
			if (err) return callback(err);

			var answer = rows[0];
			if (!answer) return callback(500);

			var categoryid = ~~answer.categoryid;

			database.query("SELECT * FROM answers WHERE categoryid = " + categoryid + " AND id != " + answerid + " ORDER BY RAND() LIMIT 3", function (err, rows) {
				if (err) return callback(err);

				var results = rows;
				results.push(answer);
				shuffleArray(results);

				// We're passing the answerid for testing purposes
				callback(null, { id: entry.id, file: entry.file, answerid: answerid, answers: results });
			});
		});
	});
}

exports.get_check = function(req, body, callback) {
	database.query("SELECT * FROM entries WHERE id = " + ~~req.args[2], function(err, rows) {
		if (err) return callback(err, { status: 500 });

		callback(null, { correct: req.args[3] == rows[0].answerid });
	});
	addSeen(req.userobj.id, req.args[2]);
}

exports.post_upload = function(req, body, callback) {
	var answerid = ~~req.args[2];
	var public = ~~req.args[3];

	upload.uploadFile(req, req.userobj.id, function(err, file) {
		if (!file) return callback(null, file);

		addQuestion(answerid, file, public, req.userobj.id);
		callback(null, { file: file });
	});
}

function addQuestion(answerid, file, public, userid) {
	database.query("INSERT INTO entries (answerid, file, userid) VALUES (" + answerid + ", '" + database.escape(file) + "', " + ~~userid + ")", function(err, rows) {
		if (err)
			console.log(err);
	});
}

function addSeen(userid, entry) {
	database.query("INSERT INTO seen (userid, entry) VALUES (" + ~~userid + ", " + entry + ")", function(err, rows) {
		if (err)
			console.log(err);
	});
}

// Fisher-Yates shuffle
function shuffleArray(array) {
	for (var i = 1; i < array.length; i++) {
		var j = Math.floor(Math.random() * array.length);
		var tmp = array[i];
		array[i] = array[j];
		array[j] = tmp;
	}
}

