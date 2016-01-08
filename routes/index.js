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
    var emailHash = crypto.createHash('md5').update(email).digest('hex');
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
    } else {
        res.send({
            msg: ''
        });
    }
});

/* GET successLogin page. */
router.get('/successLogin', function (req, res) {
    res.render('successLogin')
});

router.post('/newuser', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var emailHash = crypto.createHash('md5').update(email).digest('hex');
    var usersRef = ref.child('users');
    if (usersRef.child(emailHash)) {
        //if the email already exists
        console.log("email exists")
    } else {
        //need to make that a 
        var salt = "testsalt"
        var cipher = crypto.createCipher('aes-256-cbc', salt);
        cipher.update(password, 'utf8', 'base64');
        var submit = {
            emailHash: {
                "salt": salt,
                "hash": ciper
            }

        }
    }
});

module.exports = router;