Template.appLayout.helpers({
  /**
   * Exposes http://docs.meteor.com/#/full/meteor_status
   * adds a retryInSeconds property
   */
  connStatus: function() {
    var data = Meteor.status();
    data.retryInSeconds = Math.round((data.retryTime - new Date()) / 1000);
    if (isNaN(data.retryInSeconds)) {
      data.retryInSeconds = 0;
    }
    return data;
  }
});

Template.appLayout.onRendered(function() {
  //TODO if we don't setTimeout there is no current-username DOM elment... why?
  if (window.location.pathname === '/bad-username') {
    return;
  }
  setTimeout(function() {
    var username = document.getElementById('current-username').innerText;
    Meteor.call('validateUsername', username, function(err, isUsernameValid) {
      if (err) {
        console.log(err);
      } else if (isUsernameValid === false) {
        window.location.assign('/bad-username');
      }
    });
  }, 1000);
});