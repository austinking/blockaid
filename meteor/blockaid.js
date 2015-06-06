Blockers = new Mongo.Collection("blockers");
Comments = new Mongo.Collection("comments");

if (Meteor.isClient) {
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

  Template.create.events({
    "submit .new-blocker": function (event) {
      // This function is called when the new blocker form is submitted
      var title = event.target.title.value;
      var desc = event.target.desc.value;

      Blockers.insert({
        title: title,
        desc: desc,
        resolved: false,
        createdAt: new Date()
      });

      window.location.assign("/");

      // prevent default form submit
      return false;
    }
  });

  Template.detail.helpers({
    comments: function() {
      return Comments.find({ blockerId: this._id})
    }
  });

  Template.detail.events({
    "click .resolved": function () {
      Blockers.update(this._id, {$set: {resolved: ! this.resolved}});
    },
    "submit .new-comment": function (event) {
      var text = event.target.comment.value;
      Comments.insert({
        blockerId: this._id,
        text: text,
        createdAt: new Date()
      });
      event.target.comment.value = "";
      // prevent default form submit
      return false;
    }
  });
}

Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', function () {
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
