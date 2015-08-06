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