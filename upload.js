var fs = require("fs");

var id = (new Date).getTime().toString(36) + "-";
var increment = 0;

exports.uploadFile = function (data, userid, callback) {
	var imgid = getUniqueId(userid);
	var tmpfile = "./images/" + imgid + ".jpg";

	var stream = fs.createWriteStream(tmpfile);
	data.resume();
	data.pipe(stream);
	stream.on('finish', function() {
		callback(null, imgid);
	});
}

function getUniqueId(userid) {
	return userid + "-" + id + (increment++) + "-" + Math.random().toString(36);
}

