// DOM Ready ========================================
$(document).ready(function() {

	// Add Sign in button click
	$('#btnLogin').on('click', login);
});

// Functions ========================================
function login(event) {
	event.preventDefault();
	var errorCount = 0;
	$('#login input').each(function(index, val) {
		if($(this).val() === '') { errorCount ++;}
	});


	if(errorCount === 0) {
		$.ajax({
			type: 'POST',
			url: '/login',
		}).done(function (response) {
			if (response === '') {
				document.location.href='/successLogin'
			} else {
				alert('You have entered the wrong email/password')
			}
		});
	} else {
		alert('Please fill in all fields');
		return false;
	}
};