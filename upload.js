var fs = require("fs");
var spawn = require("child_process").spawn;

var id = (new Date).getTime().toString(36) + "-";
var increment = 0;

exports.uploadFile = function (data, userid, callback) {
	var imgid = getUniqueId(userid);
	var tmpfile = "./images/" + imgid + ".jpg";

	var stream = fs.createWriteStream(tmpfile);
	data.resume();
	data.pipe(stream);
	stream.on('finish', function() {
		var process = spawn("convert", [tmpfile,
							"-resize",
							"500x500>^",
							"-rotate",
							"270",
							"-auto-orient",
							"-strip",
							tmpfile
		]);
		process.stderr.on("data", function(data) {
			console.log("UploadErr: " + data);
		});
		process.on("close", function(code) {
			callback(code);
		});
		callback(null, imgid);
	});
}

function getUniqueId(userid) {
	return userid + "-" + id + (increment++) + "-" + Math.random().toString(36);
}

