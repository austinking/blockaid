Blockers = new Mongo.Collection("blockers");
Comments = new Mongo.Collection("comments");
PlusOnes = new Mongo.Collection("plusOnes");

if (Meteor.isServer) {
  event_init(Blockers, Comments, PlusOnes);
  // TODO - Ensure that this only runs infrequently...
  if (HipchatUsers.find().count() === 0) {
    console.log('Importing all users form Hipchat');
    refreshHipchatUserDB();
  }
}

if (Meteor.isClient) {
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

  // This code only runs on the client

  Template.home.helpers({
    blockers: function () {
      var blockers = Blockers.find({resolved: false});

      if (blockers.count()) {
        return blockers;
      } else {
        return false;
      }
    },
    resolvedBlockers: function() {
      var resolvedBlockers = Blockers.find({resolved: true});

      if (resolvedBlockers.count()) {
        return resolvedBlockers;
      } else {
        return false;
      }
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
          //window.location.assign('/bad-username');
        }
      });
    }, 1000);
  });

  Template.create.events({
    "submit .new-blocker": function (event) {
      // This function is called when the new blocker form is submitted
      if (! Meteor.userId()) return false;

      var title = event.target.title.value;
      var desc = event.target.desc.value;
      if (title == "") return false;

      Meteor.call("addBlocker", title, desc);

      window.location.assign("/");
      return false;
    }
  });

  Template.detail.helpers({
    comments: function() {
      return Comments.find({ blockerId: this._id });
    },
    plusOnes: function () {
      return PlusOnes.find({ blockerId: this._id });
    },
    plusOneCount: function () {
      return PlusOnes.find({ blockerId: this._id }).count();
    }
  });

  Template.detail.events({
    "click .resolved": function () {
      Meteor.call("toggleResolved", this._id, this.resolved);
    },
    "click .plus-one": function () {
      Meteor.call("addPlusOne", this._id, Meteor.userId());
    },
    "submit .new-comment": function (event) {
      var text = event.target.comment.value;
      if (text == "") return false;

      Meteor.call("addComment", this._id, text);
      event.target.comment.value = "";
      return false;
    }
  });

  Template.comment.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.comment.events({
    "click .edit-comment": function () {
      var text = prompt("Edit comment", this.text);
      if (text != null) {
        Meteor.call("editComment", this._id, this.owner, text);
      }
    },
    "click .remove-comment": function () {
      if (confirm("Are you sure you want to remove this comment?")) {
        Meteor.call("removeComment", this._id, this.owner);
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
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
    }

  });
}

Meteor.methods({
  addBlocker: function (title, desc) {
    requireAuth();
    Blockers.insert({
      title: title,
      desc: desc,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      resolved: false,
      createdAt: new Date(),
      plusOnes: []
    });
  },
  toggleResolved: function (id, resolved) {
    requireAuth();
    Blockers.update(id, {$set: {resolved: !resolved}});
  },
  addPlusOne: function (id, userId) {
    requireAuth();

    PlusOnes.insert({
      blockerId: id,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date()
    })
  },
  addComment: function (blockerId, text) {
    requireAuth();
    Comments.insert({
      blockerId: blockerId,
      text: text,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date()
    });
  },
  editComment: function (id, owner, text) {
    requireOwner(owner);
    Comments.update(id, {$set: {text: text}});
  },
  removeComment: function(id, owner) {
    requireOwner(owner);
    Comments.remove({_id: id});
  }
});

function requireAuth() {
  if (!Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
}
function requireOwner(owner) {
  if (owner != Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
}

Router.configure({
  layoutTemplate: 'appLayout'
});
Router.route('/', function () {
  console.log('home');
  console.log(Meteor.user());
  this.render('home');
});
Router.route('/create');
Router.route('/detail');
Router.route('/detail/:_id', function () {
  this.render('detail', {
    data: function () {
      return Blockers.findOne({_id: this.params._id});
    }
  });
});
