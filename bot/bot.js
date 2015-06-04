var fs = require('fs');
var path = require('path');

var Hipchatter = require('hipchatter');

var config = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../config/dev.json')));

var hc = new Hipchatter(config.hipchat_bot_token);
hc.send_private_message(1073704, {
  message: "So I hear you're Blocked (blockaid)",
  notify: false,
  message_format: 'text'
}, function(err, unknown, resCode) {
  console.log(err, unknown, resCode);
});