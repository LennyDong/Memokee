// DOM Ready ========================================
$(document).ready(function () {
    $('#btnLogin').on('click', login);
    $('#btnCreate').on('click', createAcc);
    $('#btnSearch').on('click', searchDB);
    $('#btnAddService').on('click', addService);
});

var loggedIn = "test@testdomain.com";
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
                loggedIn = $('field#login input#inputEmail').val();
                document.location.href = '/pwpage'
            } else {
                document.getElementById('message').innerHTML = 'Invalid combination of username or password';
            }
        });
    } else {
        document.getElementById('message').innerHTML = 'Please fill in all fields';
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
                    loggedIn = email
                    document.location.href = '/pwpage'
                } else {
                    console.log("message is below");
                    console.log(response.msg);
                    document.getElementById('message').innerHTML = 'Account already exists!';
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


function searchDB(event) {
    event.preventDefault();
    var errorCount = 0;
    if (typeof loggedIn == 'underfined') {
        document.location.href = '/index';
    } else {
        $('#search input').each(function (index, val) {
            if ($(this).val() === '') {
                errorCount++;
            }
        });
        if (errorCount === 0) {
            console.log('no empty fields');
            var search = $('field#search input#searchBar').val();
            var searchAttempt = {
                'email': loggedIn,
                'search': search,
            }
            $.ajax({
                type: 'POST',
                data: searchAttempt,
                url: '/pwpage',
                dataType: 'JSON'
            }).done(function (response) {
                //clear table
                $("#display tr").remove();
                //set headings of table
                insertOriginal(document.getElementById("display"));
                console.log('response received');
                console.log(response);
                keys = Object.keys(response);
                console.log('keys');
                console.log(keys);
                keys.forEach(function (key) {
                    if (key.indexOf(search) !== -1) {
                        document.getElementById("message").innerHTML = 'See results below';
                        insertRow(document.getElementById("display"), response, key);
                    }
                });
            });
        } else {
            document.getElementById("message").innerHTML = 'Nothing in search bar..';
        }
    }
};

function insertRow(table, combinations, service) {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = service;
    cell2.innerHTML = combinations[service]['username'];
    cell3.innerHTML = combinations[service]['password'];
}

function insertOriginal(table) {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = 'Service';
    cell2.innerHTML = 'Username';
    cell3.innerHTML = 'Password';
}

function addService(event) {
    event.preventDefault();
    var errorCount = 0;
    if (typeof loggedIn == 'underfined') {
        document.location.href = '/index';
    } else {
        $('#add input').each(function (index, val) {
            if ($(this).val() == '') {
                errorCount ++;
            }
        });
        if (errorCount === 0) {
            var service = $('field#add input#service').val();
            var username = $('field#add input#username').val();
            var password = $('field#add input#password').val();
            var addRequest = {
                'user': loggedIn,
                'service': service,
                'username': username,
                'password': password
            };   
            $.ajax({
                type: 'POST',
                data: addRequest,
                url: '/addService',
                dataType: 'JSON'
            }).done(function (response) {
                if (response.msg === '') {
                    $('field#add input').val('');
                    document.getElementById('addMessage').innerHTML = "Service added";
                } else {
                    document.getElementById('addMessage').innerHTML = response.msg;
                }
            });
        } else {
            document.getElementById('addMessage').innerHTML = 'Please fill all three fields';
        }
    }
};