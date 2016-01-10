var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var crypto = require('crypto');
var ref = new firebase('amber-heat-4870.firebaseio.com/');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Memokee'
    });
});

/* GET newuser page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', {
        title: 'Create account'
    });
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login'
    });
});

/* POST login page. */
router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var emailHash = hash(email);
    var usersRef = ref.child('users');

    usersRef.once('value', function (snapshot) {
        var exists = (snapshot.child(emailHash).val() !== null);
        if (exists) {
            var user = usersRef.child(emailHash);
            user.child('salt').on('value', function (snapshot) {
                var salt = snapshot.val();
                var cipheredPassword = getCipheredPassword(password, salt);
                user.child('hash').on('value', function (snapshot) {
                    var passwordHash = snapshot.val();
                    if (cipheredPassword === passwordHash) {
                        res.send({
                            msg: 'true'
                        });
                    } else {
                        res.send({
                            msg: ''
                        });
                    }
                });
            });
        } else {
            res.send({
                msg: ''
            });
        }
    });
});


/* get all the pw's, usernames, and services */
router.post('/pwpage', function (req, res) {
    var email = req.body.email;
    var search = req.body.search;
    var services = ref.child('users').child(hash(email)).child('list');
    var jS;
    services.once('value', function (snapshot) {
        res.send(snapshot.val());
    });
});

router.get('/pwpage', function (req, res) {
    res.render('pwpage', {
        title: 'Welcome!'
    });
});

/* Redirect to pwpage. */
router.get('/addService', function (req, res) {
    res.redirect('/pwpage');
});

/* POST to addService. */
router.post('/addService', function (req, res) {
    var email = req.body.user;
    var hashEmail = hash(email);
    var service = req.body.service;
    var userRef = ref.child('users').child(hashEmail);
    userRef.once('value', function (snapshot) {
        var exists = snapshot.child('list').child(service).val() !== null;
        if (exists) {
            res.send({
                msg: 'Duplicate account for ' + service
            });
        } else {
            var entry = {};
            entry[service] = {
                'username': req.body.username,
                'password': req.body.password
            }
            userRef.child('list').update(entry);
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
    var email = req.body.email;
    var password = req.body.password;
    var emailHash = hash(email);
    var usersRef = ref.child('users');
    usersRef.child(emailHash).once('value', function (snapshot) {
        if (snapshot.val() !== null) {
            res.send({
                msg: '',
            });
        } else {
            var salt = "testsalt";
            var submit = {};
            submit[emailHash] = {
                'salt': salt,
                'hash': getCipheredPassword(password, salt)
            };
            usersRef.update(submit);
            res.send({
                msg: 'true'
            });
        }
    });
});


/* GET successcreate page. */
router.get('/successCreate', function (req, res) {
    res.render('successCreate')
});

/* Hashes input EMAIL. */
function hash(email) {
    return crypto.createHash('md5').update(email).digest('hex');
}

/* Get ciphered PASSWORD with SALT. */
function getCipheredPassword(password, salt) {
    var cipher = crypto.createCipher('aes-256-cbc', salt);
    cipher.update(password, 'utf8', 'base64');
    return cipher.final('base64');
}
module.exports = router;