Template.appLayout.onRendered(function() {
    var form = document.getElementById('bad-username-form');
    if (form === null) return;
    form.addEventListener('submit', submitForm, false);
}, false);

function submitForm(e) {
	e.preventDefault();
	var usernameInput = document.getElementById('username');
    if (usernameInput === null) return;
	Meteor.call('changeUsername', usernameInput.value, function(err, isUsernameValid) {
        if (err) {
            console.log(err);
        } else if (isUsernameValid === false) {
            console.log('Bad username');
        } else {
        	window.location.assign('/');
        }
     });
}