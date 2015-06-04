
var fs = require('fs');
var path = require('path');

var config = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../config/dev.json')));
