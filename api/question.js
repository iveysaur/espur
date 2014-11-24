var database = require('../database');
var upload = require('../upload');

var numCategories = 1;

// Figure out how many different categories we have in the db
database.query("SELECT COUNT(DISTINCT categoryid) FROM answers", function(err, rows) {
	numCategories = rows[0]["COUNT(DISTINCT categoryid)"] - 1;
});

exports.get_answer = function(request, response, args, body, callback) {
	var rnd = Math.round(Math.random() * numCategories) + 1;
	database.query("SELECT * FROM answers WHERE categoryid = " + rnd + " ORDER BY RAND() LIMIT 1", callback);
}

exports.post_upload = function(request, response, args, body, callback) {
	var answerid = ~~args[2];
	var public = ~~args[3];

	upload.uploadFile(body, function(err, file) {
		if (!file) return callback(null, file);

		addQuestion(answerid, file, public);
		callback(null, file);
	});
}

function addQuestion(answerid, file, public) {
	database.query("INSERT INTO entries (answerid, file) VALUES (" + answerid + ", '" + database.escape(file) + "')", function(err, rows) {
		if (err)
			console.log(err);
	});
}

