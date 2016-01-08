// DOM Ready ========================================
$(document).ready(function () {
    $('#btnLogin').on('click', login);
    $('#btnCreate').on('click', createAcc);
});

// Functions ========================================
function login(event) {
    event.preventDefault();
    var errorCount = 0;
    $('#login input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });


    if (errorCount === 0) {

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
                document.location.href = '/successLogin'
            } else {
                alert('Wrong email/password')
            }
        });
    } else {
        alert('Please fill in all fields');
        return false;
    }
};

function createAcc(event) {
    event.preventDefault();
    var errorCount = 0;
    $('#formAddUser input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    if (errorCount === 0) {
        console.log('no empty fields');
        var email = $('field#formAddUser input#inputUserEmail').val();
        var password = $('field#formAddUser input#inputUserPassword').val();
        var conf = $('field#formAddUser input#inputUserConfirmPassword').val();
        if (password === conf) {
            console.log('passwords match')
            var createAttempt = {
                'email': email,
                'password': password,
            }
            $.ajax({
                type: 'POST',
                data: createAttempt,
                url: '/newuser',
                dataType: 'JSON'
            }).done(function (response) {
                if (response.msg === 'true') {
                    document.location.href = '/successCreate'
                } else {
                    console.log("message is below");
                    console.log(response.msg);
                    alert('Something wrong happened')
                }
            });
        } else {
            console.log('Passwords do not match.')
        }
    } else {
        alert('Please fill in all fields');
        return false;
    }
};