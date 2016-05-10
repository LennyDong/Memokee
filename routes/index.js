var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var crypto = require('crypto');
var ref = new firebase('amber-heat-4870.firebaseio.com/');

/* GET home page. */
router.get('/', function (req, res, next) {
    var authData = ref.getAuth();
    if (authData === null) {
        res.render('index', {
            title: 'Memokee'
        });
    } else {
        res.redirect('/pwpage');
    }
});

/* GET newuser page. */
router.get('/newuser', function (req, res) {
    var authData = ref.getAuth();
    if (authData === null) {
        res.render('newuser', {
            title: 'Create account'
        }); 
    } else {
        res.redirect('/pwpage');
    }
});

/* GET login page. */
router.get('/login', function (req, res) {
    var authData = ref.getAuth();
    if (authData === null) {
        res.render('login', {
            title: 'Login'
        });
    } else {
        res.redirect('/');
    }
});

/* POST login page. */
router.post('/login', function (req, res) {
    var authData = ref.getAuth();
    var inputEmail = req.body.email;
    var inputPassword = req.body.password;
    ref.authWithPassword({
        email: inputEmail,
        password: inputPassword 
    }, function(error, authData) {
        if (error) {
            res.send({
                msg: "Wrong password"
            });
        } else {
            res.send({
                msg: ''
            })
        }
    }, {
        remember: 'sessionOnly'
    });
});

/* POST logout page. */
router.post('/logout', function (req, res) {
    ref.unauth();
    res.send({
        msg: ''
    });
});

/* GET logout page. */
router.get('/logout', function (req, res) {
    res.redirect('/pwpage');
});

/* get all the pw's, usernames, and services */
router.post('/pwpage', function (req, res) {
    var authData = ref.getAuth();
    var email = authData.password.email;
    var search = req.body.search;
    var services = ref.child('users').child(authData.uid);
    var jS;
    services.once('value', function (snapshot) {
        var exists = snapshot.child(search).val() !== null;
        if (exists){
            res.send({
                'password': getDecipher(snapshot.child(search).child('password').val()),
                'username': snapshot.child(search).child('username').val()
            });
        } else {
            res.send({
                msg: ''
            })
        }
    });
});

router.get('/pwpage', function (req, res) {
    var authData = ref.getAuth();
    if (authData !== null) { 
        res.render('pwpage', {
            title: 'Welcome ' + authData.password.email + '!'
        });
    } else {
        res.redirect('/');
    }
});

/* Redirect to pwpage. */
router.get('/addService', function (req, res) {
    res.redirect('/pwpage');
});

/* POST to addService. */
router.post('/addService', function (req, res) {
    var authData = ref.getAuth(); 
    var service = req.body.service;
    var usersRef = ref.child('users').child(authData.uid);
    usersRef.once('value', function (snapshot) {  
        var exists = snapshot.child(service).val() !== null;
        if (exists) {
            res.send({
                msg: 'Duplicate account for ' + service
            });
        } else {
            var entry = {};
            var salt = makeid();
            entry[service] = {
                'username': req.body.username,
                'password': salt + getCipheredPassword(req.body.password, salt)
            };
            usersRef.update(entry);
            res.send({
                msg: ''
            });
        }
    });
});

/* GET successLogin page. */
router.get('/successLogin', function (req, res) {
    res.redirect('pwpage');
});

router.post('/newuser', function (req, res) {
    var inputEmail = req.body.email;
    var inputPassword = req.body.password;
    var authData = ref.getAuth();
    if (authData !== null) {
        res.redirect('/pwpage');
    } else {
        ref.createUser({
            email: inputEmail,
            password: inputPassword
        }, function(error, userData) {
            if (error) {
                res.send({
                    msg: "Error creating user:" + error
                });
            } else {
                ref.authWithPassword({
                    email: inputEmail,
                    password: inputPassword
                }, function(error, authData) {
                    if (error) {
                        res.send("Error logging in: " + error);
                    } else {
                        authData = ref.getAuth();
                        var newUser = {};
                        newUser[authData.uid] = {
                            'placeholder': 'placeholder'
                        };
                        ref.child('users').update(newUser);
                        res.send({
                            msg: "true"
                        })
                    }
                }, {
                    remember: 'sessionOnly'
                });
            }
        });
    }
});

/* DELETE entry. */
router.delete('/deleteuser/:id', function(req, res) {
    var entryToDelete = req.params.id;
    var authData = ref.getAuth();
    ref.child('users').child(authData.uid).child(entryToDelete).remove();
    res.send({
        msg: ''
    });
});

/* GET successcreate page. */
router.get('/successCreate', function (req, res) {
    res.render('successCreate')
});

/* Returns random string of six characters. */
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < 6; i += 1){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

/* Get ciphered PASSWORD with SALT. */
function getCipheredPassword(password, salt) {
    var cipher = crypto.createCipher('aes-256-cbc', salt);
    cipher.update(password, 'utf8', 'base64');
    return cipher.final('base64');
}

/* Returns the deciphered password with the given CIPHER. */
function getDecipher(cipher) {
    var salt = cipher.substring(0, 6);
    var password = cipher.substring(6, cipher.length);
    var decipher = crypto.createDecipher('aes-256-cbc', salt);
    decipher.update(password, 'base64', 'utf8');
    return decipher.final('utf8')
    
}
module.exports = router;