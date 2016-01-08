var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var crypto = require('crypto');
var ref = new firebase('amber-heat-4870.firebaseio.com/');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
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
    var user = usersRef.child(emailHash);
    var salt = user.child('salt');
    var passwordHash = user.child('hash');

    salt.on('value', function (snapshot) {
        salt = snapshot.val();
    });

    passwordHash.on('value', function (snapshot) {
        passwordHash = snapshot.val();
    });


    var cipher = crypto.createCipher('aes-256-cbc', salt);
    cipher.update(password, 'utf8', 'base64');
    if (cipher.final('base64') === passwordHash) {
        res.send({
            msg: 'true'
        });
        var cipheredPassword = getCipheredPassword(password, salt);
        if (cipheredPassword === passwordHash) {
            res.send({
                msg: 'true'
            });
        } else {
            res.send({
                msg: ''
            });
        }
    }
});

/* GET successLogin page. */
router.get('/successLogin', function (req, res) {
    res.render('successLogin')
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