var fs = require("fs");

exports.uploadFile = function (data, callback) {
	var tmpfile = "./images/" + (new Date).getTime() + ".jpg";

	fs.writeFile(tmpfile, data, "base64", function(err) {
		data = null;

		if (err) callback(err);
		callback(null, tmpfile);
	});
}
