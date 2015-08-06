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
newBlockerKeepGoing = function (userId, url) {
  hc.send_private_message(userId, {
    message: 'Keep trying to unblock yourself and post updates to ' +
      url + ' You can also share that link when asking for help. (blockaid)',
    notify: false,
    message_format: 'text'
  }, function(err, body, resCode) {
    console.log(err, body, resCode);
  });
};

advertiseNewBlocker = function(blocker) {
  var blockaidRoomId = Meteor.settings.hipchat_annouce_channel;
  var url = blockerUrl + '/detail/' + blocker._id;
  var title = blocker.title.substring(0, 60);

  hc.notify(blockaidRoomId, {
    message: ['@', blocker.username, ' has reported a new Blocker ',
    '<a href="' + url + '">&ldquo;', title, '&rdquo;</a>'].join(''),
    notify: false,
    message_format: 'html'
  }, function(err, body, resCode) {
    console.log('err=', err, 'body=', body, 'resCode=', resCode);
  });
};

//exports.
pingHero = function (userId, url) {
  hc.send_private_message(userId, {
    message: 'You are a (blockaid) SuperHero! Got a moment to see if you can help? ' + url,
    notify: false,
    message_format: 'text'
  }, function(err, body, resCode) {
    console.log(err, body, resCode);
  });
};

sendBlockerResolved = function(userId, title, url) {
  hc.send_private_message(userId, {
    message: ['W00t! <a href="', url, '">&ldquo;', title, '&rdquo;</a> is resolved'].join(''),
    notify: false,
    message_format: 'html'
  }, function(err, body, resCode) {
    console.log(err, body, resCode);
  });
}


sendUsernameChanged = function(userId, oldUsername, newUsername) {
  hc.send_private_message(userId, {
    message: 'You have successfully changed your username from ' + oldUsername + ' to <strong>' +
    newUsername + '</strong>',
    notify: false,
    message_format: 'html'
  }, function(err, body, resCode) {
    console.log(err, body, resCode);
  });
}

// TODO - Ensure that this only runs infrequently...
// This can be tested with
// $ meteor shell
// > HipchatUsers.remove({})
// > .reload
if (HipchatUsers.find().count() === 0) {
  console.log('Importing all users form Hipchat');
  refreshHipchatUserDB();
}