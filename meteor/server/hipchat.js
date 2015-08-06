var fs = Npm.require('fs');
var path = Npm.require('path');

HipchatUsers = new Mongo.Collection("hipchat-users");

var Hipchatter = Npm.require('hipchatter');
var hc = new Hipchatter(Meteor.settings.hipchat_bot_token);

refreshHipchatUserDB = function() {
  hc.users(Meteor.bindEnvironment(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      for( var i=0; i < users.length; i++) {
        var user = users[i];
        // Maintain a case insensitive mapping key
        user.lc_username = user.mention_name.toLowerCase();
        console.log(user);
        var selector = {
          lc_username: user.lc_username
        };
        HipchatUsers.upsert(selector, {$set: user});
      }
    }
  }));
};

// Hipchat User object or undefined
getHipchatUser = function(blockaidUsername) {
  return HipchatUsers.findOne({lc_username: blockaidUsername.toLowerCase() });
};

//exports.
newBlocker = function (userId, url) {
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
//exports.
pingHero = function (userId, url) {
  hc.send_private_message(userId, {
    message: 'You are a (blockaid) SuperHero! Got a moment to see if you can help? ' + url,
    notify: false,
    message_format: 'text'
  }, function(err, unknown, resCode) {
    console.log(err, unknown, resCode);
  });
};

sendBlockerResolved = function(userId, title, url) {
  hc.send_private_message(userId, {
    message: ['W00t! <a href="', url, '">&ldquo;', title, '&rdquo;</a> is resolved'].join(''),
    notify: false,
    message_format: 'html'
  });
}


sendUsernameChanged = function(userId, oldUsername, newUsername) {
  hc.send_private_message(userId, {
    message: 'You have successfully changed your username from ' + oldUsername + ' to <strong>' +
    newUsername + '</strong>',
    notify: false,
    message_format: 'html'
  }, function(err, unknown, resCode) {
    console.log(err, unknown, resCode);
  });
}