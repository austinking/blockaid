Meteor.methods({
    validateUsername: function(username) {
      console.log('validateUsername server right? username=', username);
      var hcUsername = getHipchatUser(username);
      console.log('getHipchatUser returned hcUsername=', hcUsername);
      if (hcUsername === undefined) {
        return false;
      } else {
        return true;
      }
    },
    changeUsername: function(username) {
      var hcUser = getHipchatUser(username);

      if (hcUser === undefined) {
        throw new Error('Unknown Hipchat Username');
      } else {
        var userId = Meteor.user()._id;
        var u = Meteor.user();
        var oldUsername = u.username;
        Meteor.users.update({ _id: userId }, { $set: {username: username}});
        sendUsernameChanged(hcUser.id, oldUsername, username);
        return true;
      }
    }
  });