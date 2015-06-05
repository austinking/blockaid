var fs = require('fs');
var path = require('path');

var Hipchatter = require('hipchatter');

var config = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../config/dev.json')));

var hc = new Hipchatter(config.hipchat_bot_token);

exports.newBlocker = function (userId, url) {
  hc.send_private_message(userId, {
    message: 'Keep trying to unblock yourself and post updates to ' +
      url + ' You can also share that link when asking for help. (blockaid)',
    notify: false,
    message_format: 'text'
  }, function(err, unknown, resCode) {
    console.log(err, unknown, resCode);
  });
};

// People opt int
exports.pingHero = function (userId, url) {
  hc.send_private_message(userId, {
    message: 'You are a (blockaid) SuperHero! Got a moment to see if you can help? ' + url,
    notify: false,
    message_format: 'text'
  }, function(err, unknown, resCode) {
    console.log(err, unknown, resCode);
  });
};

var andrewF = 533649
//exports.newBlocker(andrewF, 'http://blockaid.meteor.com/detail/QndRZGn5SMdsoocy7');

var batch1 = [
533650, 1088992, 1970855, 533649, 789246, 1088987, 1073704,
1507494, 540458, 1576166, 941326, 2006290, 1783788, 1574091,
604161, 599968, 1868059, 1655007, 1074195, 651877, 
643131, 1439264, 1814731, 2016649, 1051008, 1351286, 827013, 
1770215, 1532686, 1382256, 1042389, 1934245, 1262190, 715013,
2160671, 1375367, 1726507, 1168625, 1083073, 770403, 533647];

var batch2 = [
1143948, 1532363, 1210115, 1270395, 533653, 1351289, 
1506791, 789091, 1062890, 540463, 1574095, 957277, 2045622, 
1073658, 788980, 863111, 1989766, 1904131, 682364, 803040,
1540203, 1904516, 1279259, 1467407, 661381, 2006282, 1574098,
1528765, 606593, 1528763, 777811, 1574094, 1606980, 
556839, 815598];

var team = [
  533649, // Andrew F
  788980,  // Phillip 
  2016649, // Dierdre
  815598,  // Zach
  1073704, // Austin
  533653 ];// Matt O

/*
team.forEach(function(id, i) {
  exports.pingHero(id, 'http://blockaid.meteor.com/detail/QndRZGn5SMdsoocy7');  
});
*/

batch1.forEach(function(id, i) {
  exports.pingHero(id, 'http://blockaid.meteor.com/detail/QndRZGn5SMdsoocy7');  
});
batch2.forEach(function(id, i) {
  exports.pingHero(id, 'http://blockaid.meteor.com/detail/oFN79TmdKDxxfrfzr');  
});