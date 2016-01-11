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
                msg: error
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
        res.send(snapshot.val());
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
    var service = req.body.service;
    var usersRef = ref.child('users');
    usersRef.once('value', function (snapshot) {
        var authData = ref.getAuth();    
        var exists = snapshot.child(authData.uid).child(service).val() !== null;
        if (exists) {
            res.send({
                msg: 'Duplicate account for ' + service
            });
        } else {
            var entry = {};
            entry[service] = {
                'username': req.body.username,
                'password': req.body.password
            };
            usersRef.child(authData.uid).update(entry);
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

module.exports = router;