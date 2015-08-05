var startTime = new Date();

// TODO: report flag should change to an algorithm that takes into account
// how long since we've started the server
var report = false;
Meteor.setTimeout(function() {
	report = true;
}, 3000);

// TODO: How can I access Comments and Blockers from blockaid.js here?
event_init = function(Comments, Blockers) {  
	var dataTypes = [[Comments, 'Comments'], [Blockers, 'Blockers']];
	for(var i in dataTypes) {
		var T = dataTypes[i][0];
		var TType = dataTypes[i][1];
		var query = T.find();
		query.observeChanges({
		  added: function(id, fields) {		  	
		  	if (report) console.log(TType + '.observeChanges added id=', id, 'fields=', fields);
        if (report) {
          pingHero(1073704, 'http://localhost:3000/detail/' + fields.blockerId);
        }
		  },
		  changed: function(id, fields) {
			if (report) console.log(TType + '.observeChanges changed id=', id, 'fields=', fields);
		  },
		  removed: function(id) {
			if (report) console.log(TType + '.observeChanges removed id=', id);
		  }
		});
	}
}