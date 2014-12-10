var fs = require("fs");

var id = (new Date).getTime().toString(36) + "-";
var increment = 0;

exports.uploadFile = function (data, userid, callback) {
	var imgid = getUniqueId(userid);
	var tmpfile = "./images/" + imgid + ".jpg";

	fs.writeFile(tmpfile, data, "base64", function(err) {
		data = null;

		if (err) callback(err);
		callback(null, imgid);
	});
}

function getUniqueId(userid) {
	return userid + "-" + id + (increment++) + "-" + Math.random().toString(36);
}

