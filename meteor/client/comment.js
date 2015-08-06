Template.comment.helpers({
    isOwner: function() {
        return this.owner === Meteor.userId();
    }
});

Template.comment.events({
      "click .edit-comment": function() {
          var text = prompt("Edit comment", this.text);
          if (text != null) {
              Meteor.call("editComment", this._id, this.owner, text);
          }
      },
      "click .remove-comment": function() {
          if (confirm("Are you sure you want to remove this comment?")) {
              Meteor.call("removeComment", this._id, this.owner);
          }
      }
  });