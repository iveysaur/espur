var fs = require('fs');
var config = require('./config');

var htmlData = fs.readFileSync("index.html");
htmlData = htmlData.toString().replace("{{ base }}", config.base);

module.exports = function(res) {
	res.write(htmlData);
	res.end();
}
