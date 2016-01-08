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

		var loginAttempt = {
			'email': $('field#login input#inputEmail').val(),
			'password': $('field#login input#inputPassword').val()
		}
		$.ajax({
			type: 'POST',
			data: loginAttempt,
			url: '/login',
			dataType: 'JSON'
		}).done(function (response) {
			if (response.msg === 'true') {
				document.location.href='/successLogin';
			} else {
				alert('Wrong email/password');
			}
		});
	} else {
		alert('Please fill in all fields');
		return false;
	}
};