// This code only runs on the client
Template.create.events({
    "submit .new-blocker": function(event) {
        // This function is called when the new blocker form is submitted
        if (!Meteor.userId()) return false;

        var title = event.target.title.value;
        var desc = event.target.desc.value;
        if (title == "") return false;

        Meteor.call("addBlocker", title, desc);

        window.location.assign("/");
        return false;
    }
});