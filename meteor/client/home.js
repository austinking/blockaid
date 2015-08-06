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