userUrl = function(username) {
  var hcUser = getHipchatUser(username);
  if (hcUser) {
    return 'https://helpscore.hipchat.com/chat/user/' + hcUser.id;
  } else {
    // Bad username... link to Engineering?
    return 'https://helpscore.hipchat.com/chat/room/338079';
  }
}

blockerUrl = function(blockerId) {
	return Meteor.settings.baseUrl + '/detail/' + blockerId;
}