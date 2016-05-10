// DOM Ready ========================================
$(document).ready(function () {
    $('#btnLogin').on('click', login);
    $('#btnCreate').on('click', createAcc);
    $('#btnSearch').on('click', searchDB);
    $('#btnAddService').on('click', addService);
    $('#btnLogout').on('click', logout);
    $('#search table#display tbody').on('click', 'td a.linkdeleteuser', deleteEntry);
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
            if (response.msg === '') {
                document.location.href = '/pwpage';
            } else {
                document.getElementById('message').innerHTML = response.msg;
            }
        });
    } else {
        document.getElementById('message').innerHTML = 'Please fill in all fields';
        return false;
    }
};

function logout (event) {
    console.log('here');
    event.preventDefault();
    var decision = confirm('Are you sure you want to log out?');
    if (decision) {
        $.ajax({
            type: 'POST',
            url: '/logout'
        }).done(function (response) {
            document.location.href = '/';
        });
    }
}

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
                    document.location.href = '/pwpage'
                } else {
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
    $('#search input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });
    if (errorCount === 0) {
        var search = $('field#search input#searchBar').val();
        display(search);
    } else {
        document.getElementById("message").innerHTML = 'Nothing in search bar..';
    }
};

function insertRow(table, combinations, service) {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = service;
    cell2.innerHTML = combinations['username'];
    cell3.innerHTML = combinations['password'];
    cell4.innerHTML = '<td><a href="#" class="linkdeleteuser" rel="' + service + '">Delete</a></td>';
}

function insertOriginal(table) {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = 'Service';
    cell2.innerHTML = 'Username';
    cell3.innerHTML = 'Password';
    cell4.innerHTML = 'Delete?';
}

function addService(event) {
    event.preventDefault();
    var errorCount = 0;
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
            console.log('here in podfdsf');        
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
};

function deleteEntry(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this entry?');
    console.log($(this).attr('rel'));
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {

            if (response.msg === '') {

            } else {
                alert('Error: ' + response.msg);
            }
            console.log('here');
            $("#display tr").remove();
            insertOriginal(document.getElementById("display"));
        });
    } else {
        return false;
    }
}

function display (search) {
    var searchAttempt = {
        'search': search,
    }
    $.ajax({
        type: 'POST',
        data: searchAttempt,
        url: '/pwpage',
        dataType: 'JSON'
    }).done(function (response) {
        //clear table
        if(response.msg != ''){
            $("#display tr").remove();
            //set headings of table
            insertOriginal(document.getElementById("display"));
            keys = Object.keys(response);
            document.getElementById("message").innerHTML = 'See results below';
            insertRow(document.getElementById("display"), response, search);
        } else {
            console.log("didn't find");
            document.getElementById("message").innerHTML = 'Service does not exists';
        }
    });
}
