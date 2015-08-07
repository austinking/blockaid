Blockers = new Mongo.Collection("blockers");
Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
    event_init(Blockers, Comments);
}

Meteor.methods({
    addBlocker: function(title, desc) {
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
    toggleResolved: function(id, resolved) {
        requireAuth();
        Blockers.update(id, {
            $set: {
                resolved: !resolved
            }
        });
    },
    addPlusOne: function(id, userId) {
        requireAuth();

        var blocker = Blockers.findOne(id);
        var plusOnes = blocker.plusOnes || [];
        var ownerId = Meteor.userId();

        plusOnes.push({
            ownerId: ownerId,
            username: Meteor.user().username,
            createdAt: new Date()
        });

        Blockers.update(id, {
            $set: {
                plusOnes: plusOnes,
                plusOneCount: plusOnes.length
            }
        });
    },
    addComment: function(blockerId, text) {
        requireAuth();
        Comments.insert({
            blockerId: blockerId,
            text: text,
            owner: Meteor.userId(),
            username: Meteor.user().username,
            createdAt: new Date()
        });
    },
    editComment: function(id, owner, text) {
        requireOwner(owner);
        Comments.update(id, {
            $set: {
                text: text
            }
        });
    },
    removeComment: function(id, owner) {
        requireOwner(owner);
        Comments.remove({
            _id: id
        });
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
Router.route('/', function() {
    console.log('home');
    console.log(Meteor.user());
    this.render('home');
});
Router.route('/create');
Router.route('/detail');
Router.route('/detail/:_id', function() {
    this.render('detail', {
        data: function() {
            return Blockers.findOne({
                _id: this.params._id
            });
        }
    });
});
Router.route('/bad-username');