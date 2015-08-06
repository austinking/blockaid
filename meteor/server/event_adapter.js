var _ = Npm.require('underscore');
var startTime = new Date();

// TODO: report flag should change to an algorithm that takes into account
// how long since we've started the server
var report = false;
Meteor.setTimeout(function() {
	report = true;
}, 3000);

// TODO: How can I access Comments and Blockers from blockaid.js here?
event_init = function() {
  var query = Blockers.find();
  query.observeChanges({
    added: function(id, fields) {
      // A new blocker... ping heros
      if (report) console.log('Blockers' + '.observeChanges added id=', id, 'fields=', fields);

      if (false === true && report && !! fields.blockerId) {
        pingHero(1073704, 'http://localhost:3000/detail/' + fields.blockerId);
      }
    },
    changed: function(id, fields) {
      if (typeof fields.resolved === 'boolean' && fields.resolved) {
        blockerResolved(id);
      }
      if (report) console.log('Blockers' + '.observeChanges changed id=', id, 'fields=', fields);
    },
    removed: function(id) {
      if (report) console.log('Blockers' + '.observeChanges removed id=', id);
    }
  });


  query = Comments.find();
    query.observeChanges({
      added: function(id, fields) {
        if (report) console.log('Comments' + '.observeChanges added id=', id, 'fields=', fields);
        if (false === true && report && !! fields.blockerId) {
          pingHero(1073704, 'http://localhost:3000/detail/' + fields.blockerId);
        }
      },
      changed: function(id, fields) {
        if (report) console.log('Comments' + '.observeChanges changed id=', id, 'fields=', fields);
      },
      removed: function(id) {
        if (report) console.log('Comments' + '.observeChanges removed id=', id);
      }
    });

}

function blockerResolved(blockerId) {
  if (! blockerId) throw new Error('No blockerId');
  var blocker = Blockers.findOne(blockerId);
  if (typeof blocker === 'undefined') {
    console.log('Ouch', blockerId);
    return;
  }

  var title = blocker.title.substring(0, 60);
  var url = blockerUrl(blocker._id);

  //TODO get hipchatUserId from mongoUserId
  var userIds = allUserIdsForBlocker(blocker);
  if (true == true) {
    console.log('sending Blcoker Resolved to ', userIds, title, url);
    return;
  }
  var hipchatUserId = 1073704;
  sendBlockerResolved(hipchatUserId, title, url);
}

function allUserIdsForBlocker(blocker) {
  var commentUserIds = Comments.find({blockerId: blocker._id })
    .map(function(comment) { return comment.owner });

  var plusOneUserIds = PlusOnes.find({blockerId: blocker._id })
    .map(function(plusOne) { return plusOne.owner });

  console.log(plusOneUserIds);

  return _.uniq(_.union([blocker.owner], commentUserIds));
}